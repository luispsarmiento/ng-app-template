import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QuizAttempt } from '../../pages/quiz/quiz.component';

@Component({
  selector: 'app-quiz-sidebar',
  templateUrl: './quiz-sidebar.component.html',
  styleUrls: ['./quiz-sidebar.component.css']
})
export class QuizSidebarComponent implements OnInit {

  @Input() isOpen = false;
  @Input() attempts: QuizAttempt[] = [];
  @Output() onClose = new EventEmitter<void>();

  constructor(){

  }
  ngOnInit(): void {
    
  }

  close(): void {
    this.onClose.emit();
  }

}
