import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './pages/login/login.component';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AuthRoutingModule,
    FormsModule,
    FontAwesomeModule
  ],
  declarations: [
    LoginComponent
  ]
})
export class AuthModule { }
