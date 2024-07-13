import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AbmAlumnosRoutingModule } from './abm-alumnos-routing.module';
import { AbmAlumnosComponent } from './abm-alumnos.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AlumnosDialogModule } from '../alumnos-dialog/alumnos-dialog.module';

@NgModule({
  declarations: [
    AbmAlumnosComponent
  ],
  exports: [
    AbmAlumnosComponent,
    MatButtonModule,
    MatIconModule
  ],
  imports: [
    CommonModule,
    AbmAlumnosRoutingModule,
    MatButtonModule,
    MatIconModule,
    AlumnosDialogModule
  ]
})
export class AbmAlumnosModule { }
