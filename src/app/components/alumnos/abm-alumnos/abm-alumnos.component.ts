import { Component, Input, EventEmitter, Output } from '@angular/core';
import { AlumnosDialogComponent } from '../alumnos-dialog/alumnos-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Alumno } from '../../../models/alumno';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';


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
    const dialogRef = this.matDialog.open(AlumnosDialogComponent);

    dialogRef.componentInstance.onSubmitAlumnoEvent.subscribe((alumno: Alumno) => {
      this.ondSubmitAlumno(alumno);
    });
  }

  ondSubmitAlumno(alumno: Alumno): void {
    const maxId = Math.max(...this.listaAlumnos.map(a => +a.id));
    const newId = (maxId + 1).toString();

    const { id, ...rest } = alumno;
    const newAlumno: Alumno = { id: newId, nombre: rest.nombre.toUpperCase(), apellido: rest.apellido.toUpperCase() };

    this.listaAlumnos = [...this.listaAlumnos, newAlumno];

    this.alumnosUpdateLista();
  }

  deleteAlumno(id: string): void {
    const alumno = this.listaAlumnos.find(alumno => alumno.id === id);
    const dialogRef = this.matDialog.open(DeleteDialogComponent, {data: alumno});
    
    dialogRef.componentInstance.deleteAlumnoEvent.subscribe((alumno: Alumno) => {
      this.listaAlumnos = this.listaAlumnos.filter(alumno => alumno.id !== id);
      this.alumnosUpdateLista();
    })
  }

  updateAlumno(editingAlumno: Alumno): void{
    this.matDialog.open(AlumnosDialogComponent, {data: editingAlumno}).afterClosed().subscribe({
      next: (value) => {
        if(!!value){
          this.listaAlumnos = this.listaAlumnos.map((element) => element.id === editingAlumno.id ? {id: editingAlumno.id, nombre: value.nombre.toUpperCase(), apellido: value.apellido.toUpperCase()}: element)
          this.alumnosUpdateLista();
        }
      }
    })
  }

  alumnosUpdateLista(): void {
    this.arrayAlumnos.emit(this.listaAlumnos);
  }
}
