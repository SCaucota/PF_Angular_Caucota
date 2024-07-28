import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CoursesComponent } from './features/dashboard/courses/courses.component';
import { StudentsComponent } from './features/dashboard/students/students.component';
import { LessonsComponent } from './features/dashboard/lessons/lessons.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children:
    [
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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
