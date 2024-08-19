import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesRoutingModule } from './courses-routing.module';
import { CoursesComponent } from './courses.component';
import { CoursesDialogComponent } from './components/courses-dialog/courses-dialog.component';
import { CrudCoursesComponent } from './components/crud-courses/crud-courses.component';
import { SharedModule } from '../../../shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { CourseEffects } from './store/course.effects';


@NgModule({
  declarations: [
    CoursesComponent,
    CoursesDialogComponent,
    CrudCoursesComponent,
  ],
  exports: [
    CoursesComponent
  ],
  imports: [
    CommonModule,
    CoursesRoutingModule,
    SharedModule,
    EffectsModule.forFeature([CourseEffects])
  ]
})
export class CoursesModule { }
