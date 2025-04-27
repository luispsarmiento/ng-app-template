import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { faList, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  standalone: false
})
export class TaskListComponent implements OnInit {
  @ViewChild('faSpinnerC', { static: false }) faSpinnerC: any;
  
  @Input() tasks: Task[] = [];
  @Input() loading: boolean = false;
  @Output() taskStatusChange = new EventEmitter<Task>();
  @Output() taskDelete = new EventEmitter<Task>();
  @Output() taskSelect = new EventEmitter<Task>();
  @Output() taskMoveToSpace = new EventEmitter<Task>();

  faSpinner = faSpinner
  faList = faList;

  readonly STATUS_COMPLETED = 'completed';
  readonly STATUS_PENDING = 'pending';

  constructor() { }

  ngOnInit() {
    this.faSpinnerC.animation.set('spin');
  }

}
