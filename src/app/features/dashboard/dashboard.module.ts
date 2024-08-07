import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { LayoutModule } from "./layout/layout.module";
import { SharedModule } from '../../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { LessonsModule } from './lessons/lessons.module';
import { CoursesModule } from './courses/courses.module';
import { UsersModule } from './users/users.module';
import { InscriptionsModule } from './inscriptions/inscriptions.module';

@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
  ],
  exports: [
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    LayoutModule,
    SharedModule
]
})
export class DashboardModule { }
