import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { SidenavbarComponent } from './components/sidenavbar/sidenavbar.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { LayoutComponent } from './layout.component';
import { StudentsModule } from '../students/students.module';


@NgModule({
  declarations: [
    LayoutComponent,
    SidenavbarComponent,
    ToolbarComponent
  ],
  exports: [
    LayoutComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    MatSidenavModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    StudentsModule
  ]
})
export class LayoutModule { }
