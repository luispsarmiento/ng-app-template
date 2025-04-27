import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskOverviewComponent } from './components/task-overview/task-overview.component';
import { AllComponent } from './pages/all/all.component';
import { MyDayComponent } from './pages/my-day/my-day.component';

const routes: Routes = [
    {
      path: '',
      children: [
        {
          path: '',
          redirectTo: 'my-day',
          pathMatch: 'full'
        },
        {
          path: 'all',
          component: AllComponent,
        },
        {
          path: 'my-day',
          component: MyDayComponent,
        },
      ]
    }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class TaskRoutingModule {}