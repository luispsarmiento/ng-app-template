import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { QuizService } from 'src/app/services/quiz.service';

export interface Quiz{
  id: number;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  Question_text: string;
  Answer_type: string;
  Correct_option: string;
  Points: string;
  Option_1: string;
  Option_2: string;
  Option_3: string;
  Option_4: string;
}

export interface QuizAttempt {
  id?: number;
  quizId: number;
  date: string;
  score: number;
  totalQuestions: number;
}

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit, AfterViewInit {

  questions: QuizQuestion[] = [];

  currentQuestionIndex = 0;
  selectedAnswer: string | null = null;
  score = 0;
  title = 'Quiz';
  isSidebarOpen = false;
  currentDate = new Date().toLocaleDateString();
  isInputValid = true;
  showFeedback = false;
  isCorrectAnswer = false;
  hasAnswered = false;
  attempts: QuizAttempt[] = [];
  hasFinished = false;
  quizId$: Observable<string | undefined>;
  quizId: number = 0;

  constructor(
    private router: Router, 
    public quizService: QuizService,
    private activatedRoute: ActivatedRoute){
    this.quizId$ = this.activatedRoute.params.pipe(map((params) => params['id']));
  }
  ngAfterViewInit(): void {
    this.quizService.getQuestions(this.quizId).then(v => this.questions = v);
  }

  ngOnInit() {
    this.quizId$.subscribe(v => this.quizId = parseInt(v ?? '0'));
  }

  get currentQuestion(): QuizQuestion {
    return this.questions[this.currentQuestionIndex];
  }

  handleAnswerSelect(answer: string): void {
    if (!this.hasAnswered) {
      let _answer = "";
      switch(answer.replaceAll('Option_', '')){
        case "1":
          _answer = "a";
          break;
        case "2":
          _answer = "b";
          break;
        case "3":
          _answer = "c";
          break;
        case "4":
          _answer = "d";
          break;
      }
      this.selectedAnswer = _answer;
      this.showFeedback = false;
    }
  }

  validateAnswer(): void {
    if (this.selectedAnswer && !this.hasAnswered) {
      this.isCorrectAnswer = this.selectedAnswer === this.questions[this.currentQuestionIndex].Correct_option;
      if (this.isCorrectAnswer) {
        this.score++;
      }
      this.showFeedback = true;
      this.hasAnswered = true;
    }
  }

  handleSubmit(): void {
    if (!this.hasAnswered) {
      this.validateAnswer();
    } else {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
        this.selectedAnswer = null;
        this.showFeedback = false;
        this.hasAnswered = false;
      } else {
        const attempt: QuizAttempt = {
          quizId: this.quizId,
          date: new Date().toLocaleString(),
          score: this.score,
          totalQuestions: this.questions.length
        };
        this.quizService.saveAttempt(attempt)
        this.viewResults();
        this.hasFinished = true;
      }
    }
  }

  viewResults(): void {
    this.isSidebarOpen = true;
    this.quizService.getAttempts(this.quizId).then(v => {
      this.attempts = v
    });
  }

  getOptionClass(option: string): string {
    if (!this.showFeedback) {
      return this.selectedAnswer === option ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200';
    }

    if (option === this.questions[this.currentQuestionIndex].Correct_option) {
      return 'bg-green-500 text-white';
    }

    if (this.selectedAnswer === option && !this.isCorrectAnswer) {
      return 'bg-red-500 text-white';
    }

    return 'bg-gray-100 opacity-50';
  }

  resetQuiz(): void {
    this.currentQuestionIndex = 0;
    this.selectedAnswer = null;
    this.score = 0;
    this.isInputValid = true;
    this.showFeedback = false;
    this.isCorrectAnswer = false;
    this.hasAnswered = false;
    this.hasFinished = false;
  }

}
