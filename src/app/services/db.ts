// db.ts
import Dexie, { Table } from 'dexie';
import { Quiz, QuizAttempt, QuizQuestion } from '../modules/quiz/pages/quiz/quiz.component';
export interface TodoList {
  id?: number;
  title: string;
}
export interface TaskItem {
  id?: number;
  todoListId?: number;
  title: string;
  isDone?: boolean;
}
const dbName = 'mt-todo-db';
export class AppDB extends Dexie {
  Task!: Table<TaskItem, number>;
  Quiz!: Table<Quiz, number>;
  QuizAttempt!: Table<QuizAttempt, number, QuizAttempt>;
  //todoLists!: Table<TodoList, number>;

  constructor() {
    super(dbName);
    this.version(3).stores({
      //todoLists: '++id',
      Task: '++id',
      Quiz: '++id',
      QuizAttempt: '++id'
    });
    this.on('populate', () => this.populate());
  }

  async populate() {
    /*const todoListId = await db.todoLists.add({
      title: 'To Do Today',
    });
    await db.todoItems.bulkAdd([
      {
        todoListId,
        title: 'Feed the birds',
      },
      {
        todoListId,
        title: 'Watch a movie',
      },
      {
        todoListId,
        title: 'Have some sleep',
      },
    ]);*/
  }
}

export const db = new AppDB();

