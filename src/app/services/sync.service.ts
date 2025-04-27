import { Injectable } from '@angular/core';
import { DbService } from './db.service';
import { environment } from 'src/environments/environment';
import { Task } from '../models/task.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, forkJoin, map, tap } from 'rxjs';
import { HttpResponse } from '../models/http.model';
import { checkToken } from '../interceptors/token.interceptor';
import { LoaderService } from './loader.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class SyncService extends HttpService {
  private syncEvtSubject = new BehaviorSubject<void>(undefined);
  syncEvt$ = this.syncEvtSubject.asObservable();

  readonly worker: Worker | undefined;

  readonly endpoint = "/tasks"

  private syncQueue: Array<any> = [];

  constructor(
    private db: DbService,
    private http: HttpClient,
    private loaderService: LoaderService
  ) {
    super();
    if ( typeof Worker !== 'undefined' ){
      this.worker = new Worker(new URL('../workers/sync.worker', import.meta.url), { type: 'module' });
    
      this.worker.onmessage = ({data}) => {
        if (data === 'sync-tasks'){
          this.sync();
        }
      }
    } else {
      console.error('Web Workers are not supported in this environment.');
    }
  }

  requestSync(command: 'sync-tasks'){
    this.worker?.postMessage(command);
  }

  private async sync() {
    let tasks: Array<Task> | undefined = [];

    const query = (await this.db.find('Task')) as Array<Task>;
    
    tasks = query.filter(t => !t.isSync);

    if (typeof tasks !== 'undefined') {
      this.loaderService.show();
      this.syncQueue = [];

      for (let task of tasks) {
        let req;

        if (typeof task._id !== 'undefined') {
          if (!task.isDeleted){
            const data = {
              name: task.name,
              priority: task.priority,
              scheduledDate: task.scheduledDate,
              status: task.status,
              completedDate: task.completedDate?.toString() != "1970-01-01T00:00:00.000Z" ? task.completedDate : "1970-01-01 00:00:00",
              notes: task.notes ?? "",
              subTasks: task.subTasks ?? [],
              startDate: task.startDate ?? null,
              breakDate: task.breakDate ?? null,
            };

            req = this.http.patch<HttpResponse<{ message: string, data: Task }>>(`${environment.baseUrl}${this.endpoint}/${task._id}`, data, { context: checkToken() })
              .pipe(
                map((res: HttpResponse<{ message: string, data: Task }>) => {
                  let _task = { ...task, ...res.data, isSync: true };
  
                  this.db.update('Task', _task.id, _task);
                }),
                catchError(this.handleError));
          } else {
            req = this.http.delete<HttpResponse<any>>(`${environment.baseUrl}${this.endpoint}/${task._id}`, { context: checkToken() })
            .pipe(
              map((res: HttpResponse<any>) => {
                this.db.delete('Task', task.id);
              }),
              catchError(this.handleError)
            );
          }
        } else {
          const data = {
            name: task.name,
            priority: task.priority,
            scheduledDate: task.scheduledDate,
            //status: task.status,
            completedDate: task.completedDate,
            space_id: task.space_id,
          };

          req = this.http.post<HttpResponse<{ _id: string }>>(`${environment.baseUrl}${this.endpoint}`, data, { context: checkToken() })
            .pipe(
              map((res: HttpResponse<{ _id: string }>) => {
                let _task = { ...task, _id: res.data._id, isSync: true };

                this.db.update('Task', _task.id, _task);
              }),
              catchError(this.handleError)
            );
        }
        this.syncQueue.push(req);
      }

      await forkJoin(this.syncQueue).toPromise().catch(err => { });

      this.syncQueue = [];
      this.loaderService.close();
      //this.syncEvtSubject.next();
    }
  }

  public syncGet(): Observable<Task[]> {
    return this.http.get<Task[]>(`${environment.baseUrl}${this.endpoint}`, {context: checkToken()})
    .pipe(
      tap(async (res: Task[]) => {
        const tasks = await this.db.find('Task');
        for(let _task of res){
          const taskIndex = tasks.findIndex(_e => _e._id != undefined && _e._id == _task._id);
          if(taskIndex >= 0){
            let _new = {...tasks[taskIndex], ..._task, isSync: true, isDeleted: false};
            _new = this.setPriority_Tmp(_new);
            this.db.update('Task', tasks[taskIndex].id, _new);
          } else {
            let _new = {..._task, isSync: true, isDeleted: false} as Task;
            _new = this.setPriority_Tmp(_new);
            this.db.add('Task', _new);
          }
        }
      }),
      catchError(this.handleError)
    );
  }

  private setPriority_Tmp(task: Task){
    task.priority = task.priority ?? 0;

    return task;
  }
}
