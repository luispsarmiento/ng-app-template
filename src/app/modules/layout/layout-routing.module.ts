import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './components/layout/layout.component';

const routes: Routes = [
    {
      path: '',
      component: LayoutComponent,
      children: [
        {
          path: '',
          redirectTo: 'task',
          pathMatch: 'full'
        },
        /*{
          path: 'boards',
          canActivate: [ AuthGuard ],
          loadChildren: () =>
            import('../boards/boards.module').then((m) => m.BoardsModule),
        },
        {
          path: 'profile',
          canActivate: [ AuthGuard ],
          loadChildren: () =>
            import('../profile/profile.module').then((m) => m.ProfileModule),
        },
        {
          path: 'users',
          canActivate: [ AuthGuard ],
          loadChildren: () =>
            import('../users/users.module').then((m) => m.UsersModule),
        },*/
        {
          path: 'task',
          loadChildren: () => import('../task/task.module').then(m => m.TaskModule)
        },
        {
          path: 'quiz',
          loadChildren: () => import('../quiz/quiz.module').then(m => m.QuizModule)
        },
        {
          path: 'space',
          loadChildren: () => import('../space/space.module').then(m => m.SpaceModule)
        },
        /*{ path: '**', redirectTo: 'my-day', pathMatch: 'full' },*/
      ],
    },
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class LayoutRoutingModule {}