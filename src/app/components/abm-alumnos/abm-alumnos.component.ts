import { Component, Input, EventEmitter, Output } from '@angular/core';
import { AlumnosDialogComponent } from '../alumnos-dialog/alumnos-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Alumno } from '../../models/alumno';


/* const ELEMENT_DATA: Alumno[] = [
  { id: '1', nombre: 'Juan', apellido: 'Pérez' },
  { id: '2', nombre: 'María', apellido: 'Gómez' },
]; */

@Component({
  selector: 'app-abm-alumnos',
  templateUrl: './abm-alumnos.component.html',
  styleUrl: './abm-alumnos.component.scss'
})
export class AbmAlumnosComponent {

  @Input() listaAlumnos: Alumno[] = []

  @Output() arrayAlumnos = new EventEmitter<Alumno[]>();


  constructor(private matDialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.matDialog.open(AlumnosDialogComponent)

    dialogRef.componentInstance.onSubmitAlumnoEvent.subscribe((alumno: Alumno) => {
      this.ondSubmitAlumno(alumno);
    })
  }

  ondSubmitAlumno(alumno: Alumno): void {
    const maxId = Math.max(...this.listaAlumnos.map(a => +a.id))
    const newId = (maxId + 1).toString();

    const {id, ...rest}: Alumno = alumno;
    const newAlumno: Alumno = {id: newId, ...rest}

    this.listaAlumnos = [...this.listaAlumnos, newAlumno]
    this.alumnosUpdate();
  }

  alumnosUpdate(): void {
    this.arrayAlumnos.emit(this.listaAlumnos);
  }
}
