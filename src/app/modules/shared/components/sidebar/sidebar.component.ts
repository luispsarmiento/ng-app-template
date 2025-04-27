import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Task } from 'src/app/models/task.model';
import { faClose, faSun, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {

  @ViewChildren('subtaskInput') subtaskInputs!: QueryList<ElementRef>;

  faClose = faClose;
  faSun = faSun;
  faTrash = faTrash;
  faPlus = faPlus;

  @ViewChild('mtOverlay') mtOverlay!: ElementRef;

  @Input() isOpen!: boolean;

  _taskDetail!: Task;
  @Input() 
  set taskDetail(v: Task){
    this._taskDetail = v;
    this.textareaContent = this._taskDetail.notes ?? "";
  }
  
  @Output()
  onClose = new EventEmitter();

  @Output()
  onChangeTaskDetail = new EventEmitter<Task>();

  isEditing = false;
  inputNameHasFocus = false;

  isSaveTaskNameByBlur = false;
  isSaveTaskNameByEnter = false;
  wait!: any;

  textareaContent = "";

  isAddedToMyDay: boolean = false;

  private myDayFilterFromDate!: string;
  private myDayFilterToDate!: string;

  constructor(private eRef: ElementRef) {}

  ngOnDestroy(): void {
    clearTimeout(this.wait);
  }

  ngOnInit() {
    this.onChangeTaskDetail.subscribe(_v => {
      this.isSaveTaskNameByEnter = false;
      this.isSaveTaskNameByBlur = false;
      clearTimeout(this.wait);
    });
    this.setMyDayFilterDate();
    //if the scheduledDate is equel to now, so the task is added to "My Day"
    if (this._taskDetail.scheduledDate != null || this._taskDetail.scheduledDate != undefined){
      const sd = new Date(this._taskDetail.scheduledDate);
      const _fromDate = new Date(this.myDayFilterFromDate);
      const _toDate = new Date(this.myDayFilterToDate);

      this.isAddedToMyDay = _fromDate.getTime() <= sd.getTime() && sd.getTime() <= _toDate.getTime();
    }
  }

  onBackdropClick(event: MouseEvent) {
    if (this.isOpen && !this.mtOverlay.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  saveTaskNameByBlur(event: Event){
    if(!this.isSaveTaskNameByEnter){
      console.warn("guardado desde blur");
      this.isSaveTaskNameByBlur = true;
      this.saveTaskName(event);
    }
  }

  saveTaskNameByEnter(event: Event){
    if(!this.isSaveTaskNameByBlur){
      console.warn("guardado desde enter");
      this.isSaveTaskNameByEnter = false;
      this.saveTaskName(event);
    }
  }

  onTextareaChange() {
    if (this._taskDetail.notes != this.textareaContent){
      this._taskDetail.notes = this.textareaContent;
      this._taskDetail.isSync = false;
    }
  }

  addToMyDay(isAdded: boolean){
    this._taskDetail.scheduledDate = isAdded ? new Date().toISOString() : null;
    this.isAddedToMyDay = !this.isAddedToMyDay;
    this._taskDetail.isSync = false;
    this.onChangeTaskDetail.emit(this._taskDetail);
  }

  close(){
    if (!this._taskDetail.isSync){
      this.onChangeTaskDetail.emit(this._taskDetail);
    }
    this.onClose.emit();
  }

  addSubTask(){
    if (!this._taskDetail.subTasks) {
      this._taskDetail.subTasks = [];
    }
    this._taskDetail.subTasks.push({
      name: '',
      status: 'pending'
    });
    this._taskDetail.isSync = false;
  }

  toggleSubTask(index: number){
    if (this._taskDetail.subTasks && this._taskDetail.subTasks[index]) {
      this._taskDetail.subTasks[index].status = this._taskDetail.subTasks[index].status === 'pending' ? 'completed' : 'pending';
      this._taskDetail.isSync = false;
    }
  }

  updateSubTaskName(event: Event, index: number){
    const inputElement = event.target as HTMLInputElement;
    if (this._taskDetail.subTasks && this._taskDetail.subTasks[index]) {
      this._taskDetail.subTasks[index].name = inputElement.value;
      this._taskDetail.isSync = false;
    }
  }

  deleteSubTask(index: number){
    if (this._taskDetail.subTasks) {
      this._taskDetail.subTasks = this._taskDetail.subTasks.filter((_, i) => i !== index);
      this._taskDetail.isSync = false;
    }
  }

  addSubTaskAndFocus() {
    this.addSubTask();
    setTimeout(() => {
      const inputs = this.subtaskInputs.toArray();
      const lastInput = inputs[inputs.length - 1];
      lastInput?.nativeElement.focus();
    });
  }

  private saveTaskName(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (this._taskDetail.name != inputElement.value){
      this._taskDetail.name = inputElement.value;
      this.isEditing = false;
      this._taskDetail.isSync = false;
    }
  }

  private setMyDayFilterDate(){
    let now = new Date();
    this.myDayFilterFromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    this.myDayFilterToDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();
  }
}
