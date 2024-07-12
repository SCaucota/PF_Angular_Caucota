import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AbmAlumnosRoutingModule } from './abm-alumnos-routing.module';
import { AbmAlumnosComponent } from './abm-alumnos.component';

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
  ]
})
export class AbmAlumnosModule { }
