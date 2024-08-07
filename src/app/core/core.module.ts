import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesService } from './services/courses/courses.service';
import { TimesService } from './services/courses/times.service';
import { LessonsService } from './services/lessons/lessons.service';
import { StudentsService } from './services/students/students.service';
import { InscriptionsService } from './services/inscriptions/inscriptions.service';
import { AuthService } from './services/auth/auth.service';
import { UsersService } from './services/users/users.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    CoursesService,
    TimesService,
    LessonsService,
    StudentsService,
    InscriptionsService,
    UsersService,
    AuthService
  ]
})
export class CoreModule { }
