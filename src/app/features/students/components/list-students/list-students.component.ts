import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Student } from '../../models/student';
import { CrudStudentsComponent } from '../crud-students/crud-students.component';
import { StudentsService } from '../../../../core/services/students/students.service';

const ELEMENT_DATA: Student[] = [
  { id: '1', name: 'JUAN', surname: 'PÉREZ' },
  { id: '2', name: 'MARÍA', surname: 'GÓMEZ' },
  { id: '3', name: 'CARLOS', surname: 'LOPEZ' },
  { id: '4', name: 'ANA', surname: 'FERNÁNDEZ' },
  { id: '5', name: 'LUIS', surname: 'MARTÍNEZ' },
  { id: '6', name: 'SOFÍA', surname: 'GARCÍA' },
  { id: '7', name: 'MIGUEL', surname: 'RODRÍGUEZ' },
  { id: '8', name: 'ELENA', surname: 'MORALES' },
  { id: '9', name: 'DAVID', surname: 'NÚÑEZ' },
  { id: '10', name: 'LAURA', surname: 'RAMÍREZ' },
];

@Component({
  selector: 'app-list-students',
  templateUrl: './list-students.component.html',
  styleUrl: './list-students.component.scss'
})
export class ListStudentsComponent implements OnInit{
  
  @ViewChild(CrudStudentsComponent) crudStudentsComponent?: CrudStudentsComponent;

  displayedColumns: string[] = ['id', 'name', 'surname', 'actions'];

  constructor(private studentsService: StudentsService) { }

  dataSource: Student[] = []

  ngOnInit(): void {
    this.studentsService.getStudents().subscribe({
      next: (studentsFormDb) => {
        this.dataSource = studentsFormDb
      }
    })
  }

  /* ngAfterViewInit(): void {
    if (this.crudStudentsComponent) {
      this.crudStudentsComponent.arrayStudents.subscribe((updatedStudents: Student[]) => {
        this.updateList(updatedStudents);
      });
    }
  } */

  updateList(array: Student[]) {
    this.dataSource = array
  }

  deleteStudent(id: string):void {
    if(this.crudStudentsComponent) {
      this.crudStudentsComponent.deleteStudent(id);
    }
  }

  updateStudent(student: Student):void {
    if(this.crudStudentsComponent) {
      this.crudStudentsComponent.editStudent(student);
    }
  }

}
