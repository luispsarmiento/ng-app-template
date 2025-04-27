/*import { Component, OnInit, Inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { faClose, faCheckToSlot, faBars, faUser, faTag, faCheckSquare, faClock } from '@fortawesome/free-solid-svg-icons';
import { ToDo } from 'src/app/models/todo.model';

interface ToDoDialogData{
  todo: ToDo
}

export interface ToDoDialogResultData {
  isRefresh: boolean;
}

@Component({
  selector: 'app-todo-dialog',
  templateUrl: './todo-dialog.component.html',
  styleUrls: []
})
export class TodoDialogComponent implements OnInit {

  faClose = faClose;
  faCheckToSlot = faCheckToSlot;
  faBars = faBars;
  faUser = faUser;
  faTag = faTag;
  faCheckSquare = faCheckSquare;
  faClock = faClock;

  todo!: ToDo;

  constructor(
    private dialogRef: DialogRef<ToDoDialogResultData>,
    @Inject(DIALOG_DATA) private data: ToDoDialogData
  ) {
    this.todo = data.todo;
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close({
      isRefresh: true
    });
  }
}*/
