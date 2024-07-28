import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LessonsRoutingModule } from './lessons-routing.module';
import { CrudLessonsComponent } from './components/crud-lessons/crud-lessons.component';
import { LessonsDialogComponent } from './components/lessons-dialog/lessons-dialog.component';
import { LessonsComponent } from './lessons.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    CrudLessonsComponent,
    LessonsDialogComponent,
    LessonsComponent
  ],
  exports: [
    LessonsComponent
  ],
  imports: [
    CommonModule,
    LessonsRoutingModule,
    SharedModule
  ]
})
export class LessonsModule { }
