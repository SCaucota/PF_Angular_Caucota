import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AbmAlumnosRoutingModule } from './abm-alumnos-routing.module';
import { AbmAlumnosComponent } from './abm-alumnos.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AbmAlumnosComponent
  ],
  exports: [
    AbmAlumnosComponent
  ],
  imports: [
    CommonModule,
    AbmAlumnosRoutingModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class AbmAlumnosModule { }
