import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef, NgZone } from '@angular/core';
import { 
  faSquare,
  faSquareCheck,
  faTrash,
  faPlay,
  faPause,
  faEllipsisVertical,
  faArrowRight,
  faFolder
} from '@fortawesome/free-solid-svg-icons';
import { interval, Subscription } from 'rxjs';
import { Task } from 'src/app/models/task.model';
import { Space } from 'src/app/models/space.model';
import { SpaceService } from 'src/app/services/space.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: []
})
export class TaskComponent implements OnInit {
  @ViewChild('menuTrigger') menuTrigger: ElementRef = new ElementRef(null);

  // Inputs and Outputs
  @Input() title = '';
  @Input() isDone: boolean = false;
  @Input() task!: Task;
  @Output() onDone = new EventEmitter<boolean>();
  @Output() onDelete = new EventEmitter<void>();
  @Output() onTaskClick = new EventEmitter<void>();
  @Output() onMoveToSpace = new EventEmitter<string>();

  // Icons
  faSquare = faSquare;
  faSquareCheck = faSquareCheck;
  faPlay = faPlay;
  faPause = faPause;
  faEllipsisVertical = faEllipsisVertical;
  faArrowRight = faArrowRight;
  faFolder = faFolder;
  faTrash = faTrash;

  // UI State
  isMenuOpen = false;
  isSpacesExpanded = false;
  icon = faSquare;

  // Timer related
  focusTimer: any;
  elapsedFocustimer: string = '0:00';
  private timerSubs!: Subscription;
  private timer: number = 0;

  // Services data
  spaces$ = this.spaceService.spaces$;
  spaceName: string = "";
  spaces: Space[] = [];

  constructor(private spaceService: SpaceService) { }

  onMouseEnter(){
    this.icon = this.faSquareCheck;
  }

  onMouseLeave() {
    this.icon = this.faSquare
  }

  ngOnInit() {
    this.setFocusTimer();
    this.task.isTimerRunning = false;
    this.spaceService.spaces$.subscribe(spaces => {
      this.spaceName = spaces.find((space: Space) => space._id === this.task.space_id)?.name || "";
      
      if (this.spaces.length != spaces.length) {
        this.spaces = spaces;
      }
    });
  }

  ngOnDestroy() {
    this.stopTimeCounter();
  }

  toggleTimer() {
    if (!this.task.startDate) {
      this.startTimer();
    } else if (this.task.isTimerRunning) {
      this.pauseTimer	();
    } else {
      this.stopTimer();
    }
  }

  onDoneClick(){
    this.isDone = !this.isDone;
    this.stopTimer();
    this.onDone.emit(this.isDone);
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleSpacesMenu(event: Event) {
    event.stopPropagation();
    this.isSpacesExpanded = !this.isSpacesExpanded;
  }

  moveToSpace(spaceId: string) {
    console.log('moveToSpace');
    this.onMoveToSpace.emit(spaceId);
    this.isMenuOpen = false;
    this.isSpacesExpanded = false;
  }

  private startTimer(){
    const now = new Date().toISOString();
    // Start new timer
    this.task.startDate = now;
    this.task.isTimerRunning = true;
    this.startTimeCounter();
  }

  private pauseTimer(){
    const now = new Date().toISOString();
    // Pause timer
    this.task.breakDate = now;
    this.task.isTimerRunning = false;
    this.stopTimeCounter();
  }

  private stopTimer(){
    // Resume timer
    this.task.isTimerRunning = true;
    this.startTimeCounter();
  }

  private startTimeCounter() {
    this.stopTimeCounter();
    this.timerSubs = interval(1000).subscribe(() => {
      if (this.task?.isTimerRunning && this.task?.startDate) {
        this.elapsedFocustimer = this.getElapsedTime();
      }
    });
  }

  private stopTimeCounter(){
    if (this.timerSubs) {
      this.timerSubs.unsubscribe();
    }
  }

  private getElapsedTime(): string {
    this.timer += 1;

    const minutes = Math.floor(this.timer / 60);
    const seconds = Math.floor((this.timer % 60));

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  private setFocusTimer(){
    const seconds = Math.floor((this.task.focusTimer || 0) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    this.focusTimer = {
      seconds: seconds % 60,
      minutes: minutes % 60,
      hours: hours
    };
  }
}
