import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllComponent } from './pages/all/all.component';
import { QuizComponent } from './pages/quiz/quiz.component';

const routes: Routes = [
    {
      path: '',
      children: [
        {
          path: '',
          redirectTo: 'all',
          pathMatch: 'full'
        },
        {
          path: 'all',
          component: AllComponent,
        },
        {
          path: ':id',
          component: QuizComponent,
        },
      ]
    }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class QuizRoutingModule {}