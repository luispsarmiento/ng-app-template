import { Injectable } from '@angular/core';
import { Quiz, QuizAttempt, QuizQuestion } from '../modules/quiz/pages/quiz/quiz.component';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(
    private db: DbService
  ) {
    
  }

  private quizData: QuizQuestion[] = [
    {
      Question_text: "¿Cuál es la capital de España?",
      Answer_type: "Opción multiple",
      Correct_option: "a",
      Points: "1",
      Option_1: "Madrid",
      Option_2: "Barcelona",
      Option_3: "Valencia",
      Option_4: "Sevilla",
    },
    {
      Question_text: "¿Cuál es el río más largo de España?",
      Answer_type: "Opción multiple",
      Correct_option: "c",
      Points: "1",
      Option_1: "Ebro",
      Option_2: "Guadalquivir",
      Option_3: "Tajo",
      Option_4: "Duero"
    },
    {
      Question_text: "¿En qué año se fundó la Constitución Española?",
      Answer_type: "Opción multiple",
      Correct_option: "b",
      Points: "1",
      Option_1: "1975",
      Option_2: "1978",
      Option_3: "1980",
      Option_4: "1982"
    }
  ];

  private attempts: QuizAttempt[] = [];

  private quizUrl: string = "https://testacctnm2.blob.core.windows.net/quiz";

  async getQuestions(quizId: number): Promise<QuizQuestion[]> {
    const quiz = (await this.db.findById('Quiz', quizId));
    if (quiz === undefined){
      let _questions: QuizQuestion[] = [];
      let quizQuestion = await fetch(`${this.quizUrl}/${quizId}.json`)
      if (!quizQuestion.ok) {
        return _questions;
      }
      _questions = await quizQuestion.json();
      await this.db.add('Quiz', {
        id: quizId,
        questions: _questions
      })
      return _questions;
    }
    return quiz.questions;
  }

  saveAttempt(attempt: QuizAttempt) {
    this.db.add('QuizAttempt', attempt);
  }

  async getAttempts(quizId: number): Promise<QuizAttempt[]> {
    return (await this.db.find('QuizAttempt')).filter(i => i.quizId == quizId);
  }

}
