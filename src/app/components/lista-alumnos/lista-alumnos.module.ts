import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListaAlumnosRoutingModule } from './lista-alumnos-routing.module';
import { ListaAlumnosComponent } from './lista-alumnos.component';
import { MatTableModule } from '@angular/material/table';
import { AbmAlumnosModule } from '../abm-alumnos/abm-alumnos.module';



@NgModule({
  declarations: [
    ListaAlumnosComponent
  ],
  exports: [
    ListaAlumnosComponent
  ],
  imports: [
    CommonModule,
    ListaAlumnosRoutingModule,
    MatTableModule,
    AbmAlumnosModule
  ]
})
export class ListaAlumnosModule { }
