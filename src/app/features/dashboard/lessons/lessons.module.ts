import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LessonsRoutingModule } from './lessons-routing.module';
import { CrudLessonsComponent } from './components/crud-lessons/crud-lessons.component';
import { LessonsDialogComponent } from './components/lessons-dialog/lessons-dialog.component';
import { LessonsComponent } from './lessons.component';
import { SharedModule } from '../../../shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { LessonEffects } from './store/lesson.effects';
import { StoreModule } from '@ngrx/store';
import { lessonFeature } from './store/lesson.reducer';


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
    SharedModule,
    StoreModule.forFeature(lessonFeature),
    EffectsModule.forFeature([LessonEffects]),
  ]
})
export class LessonsModule { }
