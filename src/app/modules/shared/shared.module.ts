import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtnComponent } from './components/btn/btn.component';
import { ToastComponent } from './components/toast/toast.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DialogModule } from '@angular/cdk/dialog';
import { DialogComponent } from './components/dialog/dialog.component';
import { DialogBaseComponent } from './components/dialog-base/dialog-base.component';
import { ContentLayoutComponent } from './components/content-layout/content-layout.component';
import { NgxEditorModule } from 'ngx-editor';
import { EditorComponent } from './components/editor/editor.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    DialogModule,
    ReactiveFormsModule,
    NgxEditorModule
  ],
  declarations: [BtnComponent, ToastComponent, SidebarComponent, DialogComponent, DialogBaseComponent, ContentLayoutComponent, EditorComponent],
  exports: [BtnComponent, ToastComponent, SidebarComponent, DialogComponent, DialogBaseComponent, ContentLayoutComponent, EditorComponent]
})
export class SharedModule { }
