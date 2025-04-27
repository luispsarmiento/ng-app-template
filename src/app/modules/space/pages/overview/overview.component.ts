import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { SpaceService } from 'src/app/services/space.service';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';

const STATUS_COMPLETED = 'completed';
const STATUS_PENDING = 'pending'

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit, AfterViewInit {

  readonly STATUS_COMPLETED = STATUS_COMPLETED;
  readonly STATUS_PENDING = STATUS_PENDING;

  title: string = "Space Overview";

  spaceId$: Observable<string | undefined>;
  isEditing: any;
  spaceDescription: any;

  faEdit = faEdit;
  spaceId!: string;

  tasks: Task[] = [];
  tasks$!: any;
  tasksLoading: boolean = false;
  taskSelected!: Task

  isSidebarOpen: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: SpaceService,
    private taskService: TaskService) {
    this.spaceId$ = this.activatedRoute.params.pipe(map((params) => params['id']));
    
  }

  ngAfterViewInit(): void {
    
  }

  ngOnInit() {
    this.spaceId$.subscribe((id) => {
      if (id) {
        this.spaceId = id;

        this.service.spaces$.subscribe((spaces) => {
          const space = spaces.find((space) => space._id === id);
          if (space) {
            this.title = space.name;
            this.spaceDescription = space.description;
          }
        });
        
        this.initTaskListLiveQuery();
        this.taskService.loading$.subscribe((loading) => {
          this.tasksLoading = loading;
        });
      }
    });
  }

  saveChanges(){
    this.isEditing = false;
    this.service.update(this.spaceId, {
      name: this.title,
      description: this.spaceDescription
    }).subscribe();
  }

  selectTask($event: Task) {
    if(typeof $event._id === 'undefined'){
      return;
    }

    this.isSidebarOpen = !this.isSidebarOpen; 
    this.taskSelected = $event;
  }

  updateTaskStatus($event: Task) {
    if($event.status == STATUS_COMPLETED){
      $event.completedDate = new Date().toISOString();
    } else if ($event.status == STATUS_PENDING){
      $event.completedDate = null;
      $event.startDate = null;
      $event.breakDate = null;
    }
    this.taskService.update($event);
  }

  deleteTask($event: Task) {
    this.taskService.delete($event);
  }

  updateTask(task: Task){
    this.taskService.update(task);
  }

  moveTaskToSpace($event: Task){
    console.log('moveToSpace');
    this.taskService.moveToSpace($event, $event.space_id).subscribe();
  }

  addTask($event: string) {
    let newTask: Task = {
      name: $event,
      priority: 0,
      status: 'pending',
      isSync: false,
      isDeleted: false,
      space_id: this.spaceId
    };
    
    this.taskService.add(newTask)
  }
  
  private initTaskListLiveQuery(){
    this.tasks$ = null;
    this.tasks$ = this.taskService.liveQueryListBySpaceId(this.spaceId);
    this.tasks$.subscribe((tasks: Task[]) => {
      this.tasks = tasks;
    });
  }
  
}
