import { AfterViewInit, Component, TemplateRef, ViewChild } from '@angular/core';
import { Alumno } from '../../models/alumno';
import { AbmAlumnosComponent } from '../abm-alumnos/abm-alumnos.component';


const ELEMENT_DATA: Alumno[] = [
  { id: '1', nombre: 'Juan', apellido: 'Pérez' },
  { id: '2', nombre: 'María', apellido: 'Gómez' },
];


@Component({
  selector: 'app-lista-alumnos',
  templateUrl: './lista-alumnos.component.html',
  styleUrl: './lista-alumnos.component.scss'
})
export class ListaAlumnosComponent implements AfterViewInit{

  @ViewChild(AbmAlumnosComponent) abmAlumnosComponent?: AbmAlumnosComponent;

  displayedColumns: string[] = ['id', 'nombre', 'apellido', 'actions'];
  dataSource = ELEMENT_DATA;

  ngAfterViewInit(): void {
    console.log('AbmAlumnosComponente: ', this.abmAlumnosComponent);
    if(this.abmAlumnosComponent) {
      this.abmAlumnosComponent.alumnos = this.dataSource;
    }
  }

}
