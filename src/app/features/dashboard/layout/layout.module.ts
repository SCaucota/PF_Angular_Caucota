import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SidenavbarComponent } from './components/sidenavbar/sidenavbar.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { LayoutComponent } from './layout.component';
import { StudentsModule } from '../students/students.module';
import { SharedModule } from '../../../shared/shared.module';

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
    MatToolbarModule,
    StudentsModule,
    SharedModule,
  ]
})
export class LayoutModule { }
