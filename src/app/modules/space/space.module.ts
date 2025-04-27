import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpaceMenuComponent } from './components/space-menu/space-menu.component';
import { SharedModule } from '../shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { FormsModule } from '@angular/forms';
import { OverviewComponent } from './pages/overview/overview.component';
import { SpaceRoutingModule } from './space-routing.module';
import { TaskModule } from "../task/task.module";

@NgModule({
  imports: [
    CommonModule,
    SpaceRoutingModule,
    SharedModule,
    FontAwesomeModule,
    OverlayModule,
    CdkAccordionModule,
    FormsModule,
    TaskModule
],
  declarations: [SpaceMenuComponent, OverviewComponent],
  exports: [SpaceMenuComponent]
})
export class SpaceModule { }
