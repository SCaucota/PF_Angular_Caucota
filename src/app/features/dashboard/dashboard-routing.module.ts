import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoursesComponent } from './courses/courses.component';
import { StudentsComponent } from './students/students.component';
import { LessonsComponent } from './lessons/lessons.component';
import { InscriptionsComponent } from './inscriptions/inscriptions.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'courses',
    component: CoursesComponent
  },
  {
    path: 'students',
    component: StudentsComponent
  },
  {
    path: 'lessons',
    component: LessonsComponent
  },
  {
    path: 'inscriptions',
    component: InscriptionsComponent
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
