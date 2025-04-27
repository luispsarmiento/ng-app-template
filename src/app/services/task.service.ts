import { Injectable } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { liveQuery } from 'dexie';
import { HttpErrorHandler } from '../models/http.model';
import { SyncService } from './sync.service';
import { Task } from '../models/task.model';
import { BehaviorSubject, map, catchError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpResponse } from '../models/http.model';
import { environment } from 'src/environments/environment';
import { checkToken } from '../interceptors/token.interceptor';
import { HttpService } from './http.service';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService extends HttpService {

  private loadingSubject = new BehaviorSubject<boolean>(false);

  readonly endpointMoveToSpace = "/tasks/move-to-space";
  
  loading$ = this.loadingSubject.asObservable();
  sync$ = this.sync.syncEvt$;
  constructor(
    private db: DbService,
    private sync: SyncService,
    private http: HttpClient,
    private loaderService: LoaderService
  ) {
    super();
  }

  //tasks$ = liveQuery(() => this.listTasks());

  async listTasks(status: string = "all") {
    return (await this.find()).filter((task: Task) => !task.isDeleted && (status === 'all' || task.status === status))
                              .sort((a: Task, b: Task) => b.id - a.id);
      /*.where({
        todoListId: this.todoList.id,
      })
      .toArray();*/
  }

  async listBySchudeledDate(fromDate: string, toDate: string) {
    return (await this.find()).filter((e: Task) => {
      if (!e.scheduledDate){
        return false;
      }

      const sd = new Date(e.scheduledDate);
      const _fromDate = new Date(fromDate);
      const _toDate = new Date(toDate);

      if (!e.isDeleted && sd.getTime() != 0 && _fromDate.getTime() <= sd.getTime() && sd.getTime() <= _toDate.getTime()){
        return true;
      }

      return false;
    }).sort((a: Task, b: Task) => b.id - a.id);
      /*.where({
        todoListId: this.todoList.id,
      })
      .toArray();*/
  }

  async listBySpaceId(spaceId: any) {
    this.loadingSubject.next(true);

    let result = await this.find();

    this.loadingSubject.next(false);

    return result.filter((task: Task) => !task.isDeleted && task.space_id === spaceId)
                 .sort((a: Task, b: Task) => b.id - a.id);
  }

  liveQueryListBySpaceId(spaceId: any) {
    return liveQuery(() => this.listBySpaceId(spaceId));
  }

  async find(){
    return await this.db.find('Task');
  }

  add(task: Task) {
    this.db.add('Task', task);
    this.sync.requestSync("sync-tasks");
  }

  delete(task: Task) {
    task.isDeleted = true;
    task.isSync = false;
    this.db.update('Task', task.id, task);
    this.sync.requestSync("sync-tasks");
  }

  update(task: Task) {
    task.isSync = false;
    this.db.update('Task', task.id, task);
    this.sync.requestSync("sync-tasks");
  }

  get(){
    return this.sync.syncGet();
  }

  moveToSpace(task: Task, spaceId: any) {
    console.log('moveToSpace');
    this.loaderService.show();

    const data = {
      space_id: spaceId
    };
    
    return this.http.patch<HttpResponse<{ message: string, data: Task }>>(`${environment.baseUrl}${this.endpointMoveToSpace}/${task._id}`, data, { context: checkToken() })
                  .pipe(
                    map((res: HttpResponse<{ message: string, data: Task }>) => {
                      let _task = { ...task, ...res.data, isSync: true };
                      this.db.update('Task', _task.id, _task);
                      this.loaderService.close();
                    }),
                    catchError(err => {
                      this.loaderService.close();
                      return this.handleError(err);
                    }
                  ));
  }
}
