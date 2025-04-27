import { DatePipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, } from '@angular/core';
import { liveQuery } from 'dexie';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';

const STATUS_COMPLETED = 'completed';
const STATUS_PENDING = 'pending'

export type TaskOverviewFilter = 'MY_DAY' | 'ALL'

@Component({
  selector: 'app-task-overview',
  templateUrl: './task-overview.component.html',
  styleUrls: [],
  providers: [DatePipe]
})
export class TaskOverviewComponent implements OnInit, OnDestroy {

  @Input()
  filter: TaskOverviewFilter = 'ALL';

  @Input()
  title!: string;

  readonly STATUS_COMPLETED = STATUS_COMPLETED;
  readonly STATUS_PENDING = STATUS_PENDING;

  isInputValid: boolean = true;
  isSidebarOpen: boolean = false;
  taskSelected!: Task
  currentDate!: string | null;
  taskFilter: string = 'all';

  private myDayFilterFromDate!: string;
  private myDayFilterToDate!: string;

  constructor(
    private taskService: TaskService,
    private datePipe: DatePipe
  ) {
    
  }

  ngOnDestroy(): void {
    this.tasks$ = null;
  }

  tasks$: any;

  ngOnInit() {
    this.taskService.get().subscribe();
    this.initTaskListLiveQuery();
    this.currentDate = this.datePipe.transform(new Date(), 'fullDate');
  }

  addTask(newTaskBox: any){
    const _newTaskName = newTaskBox.value;

    if (_newTaskName && this.isInputValid){
      let newTask: Task = {
        name: _newTaskName,
        priority: 0,
        status: 'pending',
        isSync: false,
        isDeleted: false
      };

      if (this.filter == 'MY_DAY'){
        newTask.scheduledDate = new Date().toISOString()
      }
      
      this.taskService.add(newTask)

      newTaskBox.value = '';
      this.taskFilter = "all";
      this.initTaskListLiveQuery();
    }
  }

  deleteTask(task: any){
    this.taskService.delete(task);
  }

  updateTaskStatus(task: Task){
    if(task.status == STATUS_COMPLETED){
      task.completedDate = new Date().toISOString();
    } else if (task.status == STATUS_PENDING){
      task.completedDate = null;
      task.startDate = null;
      task.breakDate = null;
    }
    this.taskService.update(task);
  }

  updateTask(task: Task){
    this.taskService.update(task);
  }

  validateInput(_newTaskName: string){
    if (_newTaskName.length >= 200){
      this.isInputValid = false;
    } else {
      this.isInputValid = true;
    }
  }

  selectTask(task: Task){
    if(typeof task._id === 'undefined'){
      return;
    }

    this.isSidebarOpen = !this.isSidebarOpen; 
    this.taskSelected = task;
  }

  filterTasks(){
    this.initTaskListLiveQuery();
  }

  moveTaskToSpace(task: Task){
    this.taskService.moveToSpace(task, task.space_id).subscribe();
  }

  private setMyDayFilterDate(){
    let now = new Date();
    this.myDayFilterFromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    this.myDayFilterToDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();
  }

  private initTaskListLiveQuery(){
    this.tasks$ = null;
    switch(this.filter){
      case 'ALL':
        this.tasks$ = liveQuery(() => this.taskService.listTasks(this.taskFilter));
        break;
      case 'MY_DAY':
        this.setMyDayFilterDate();
        this.tasks$ = liveQuery(() => this.taskService.listBySchudeledDate(this.myDayFilterFromDate, this.myDayFilterToDate));
        break;
    }
  }
}
