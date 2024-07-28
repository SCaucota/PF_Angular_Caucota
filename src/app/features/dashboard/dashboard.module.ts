import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { StudentsModule } from './students/students.module';
import { CoursesModule } from './courses/courses.module';
import { LessonsModule } from './lessons/lessons.module';
import { LayoutModule } from "./layout/layout.module";
import { CoreModule } from '../../core/core.module';

@NgModule({
  declarations: [
    DashboardComponent,
  ],
  exports: [
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    StudentsModule,
    CoursesModule,
    LessonsModule,
    LayoutModule,
    CoreModule
]
})
export class DashboardModule { }
