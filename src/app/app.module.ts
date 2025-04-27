import { APP_INITIALIZER, NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
/*import { OverlayModule } from '@angular/cdk/overlay';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DialogModule } from '@angular/cdk/dialog';
import { HttpClientModule } from '@angular/common/http';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkTableModule } from '@angular/cdk/table';*/
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
/*import { LoginComponent } from './pages/login/login/login.component';
import { BtnComponent } from './components/btn/btn.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BoardsComponent } from './pages/boards/boards/boards.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BoardComponent } from './pages/board/board.component';
import { TodoDialogComponent } from './components/todo-dialog/todo-dialog.component';
import { ScrollComponent } from './pages/scroll/scroll.component';
import { TableComponent } from './pages/table/table.component';*/
import { ReactiveFormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SyncService } from './services/sync.service';
import { TokenInterceptor } from './interceptors/token.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    //LoginComponent,
    //BtnComponent,
    //BoardsComponent,
    //NavbarComponent,
    //BoardComponent,
    //TodoDialogComponent,
    //ScrollComponent,
    //TableComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    //OverlayModule,
    AppRoutingModule,
    //FontAwesomeModule,
    //CdkAccordionModule,
    //DragDropModule,
    //DialogModule,
    //HttpClientModule,
    //ScrollingModule,
    //CdkTableModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    SyncService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
