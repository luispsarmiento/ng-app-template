import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: []
})
export class AddTaskComponent implements OnInit {
  @Output() addTask = new EventEmitter<string>();

  isInputValid = true;

  constructor() { }

  ngOnInit() {
  }

  validateInput(value: string) {
    this.isInputValid = value.length < 200;
  }

  onSubmit(input: HTMLInputElement) {
    if (input.value && this.isInputValid) {
      this.addTask.emit(input.value);
      input.value = '';
    }
  }
}
