import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { QuizRoutingModule } from './quiz-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { AllComponent } from './pages/all/all.component';
import { QuizComponent } from './pages/quiz/quiz.component';
import { QuizSidebarComponent } from './components/quiz-sidebar/quiz-sidebar.component';

@NgModule({
  imports: [
    CommonModule,
    QuizRoutingModule,
    SharedModule,
    FontAwesomeModule,
    OverlayModule,
    CdkAccordionModule,
  ],
  declarations: [
    AllComponent,
    QuizComponent,
    QuizSidebarComponent
  ]
})
export class QuizModule { }
