import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { ListaAlumnosModule } from '../lista-alumnos/lista-alumnos.module';

@NgModule({
  declarations: [LayoutComponent],
  exports: [LayoutComponent],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    MatSidenavModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    ListaAlumnosModule
  ]
})
export class LayoutModule { }
