import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesService } from './services/courses/courses.service';
import { TimesService } from './services/courses/times.service';
import { LessonsService } from './services/lessons/lessons.service';
import { StudentsService } from './services/students/students.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    CoursesService,
    TimesService,
    LessonsService,
    StudentsService
  ]
})
export class CoreModule { }
