import { Component, Input, EventEmitter } from '@angular/core';
import { AlumnosDialogComponent } from '../alumnos-dialog/alumnos-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Alumno } from '../../models/alumno';

@Component({
  selector: 'app-abm-alumnos',
  templateUrl: './abm-alumnos.component.html',
  styleUrl: './abm-alumnos.component.scss'
})
export class AbmAlumnosComponent {

  @Input() alumnos: Alumno[] = [];
 
  constructor(private matDialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.matDialog.open(AlumnosDialogComponent)

    dialogRef.componentInstance.onSubmitAlumnoEvent.subscribe((alumno: Alumno) => {
      this.ondSubmitAlumno(alumno);
    })
  }

  ondSubmitAlumno(alumno: Alumno): void {
    this.alumnos.push(alumno)
    console.log(this.alumnos)
  }
}
