import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Student } from '../../../features/students/models/student';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  private STUDENTS_DATABASE: Student[] = [
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
  ]
  
  getStudents(): Observable<Student[]> {
    return of([...this.STUDENTS_DATABASE])
  }

  getStudentById(id: string) {
    return this.STUDENTS_DATABASE.find(student => student.id === id)
  }

  addStudent(student: Student) {
    const maxId = Math.max(...this.STUDENTS_DATABASE.map(a => +a.id));
    const newId = (maxId + 1).toString();

    this.STUDENTS_DATABASE.push({id: newId, name: student.name.toUpperCase(), surname: student.surname.toUpperCase()});
    return student
  }

  deleteStudent(id: string) {
    this.STUDENTS_DATABASE = this.STUDENTS_DATABASE.filter(student => student.id !== id)
  }

  editStudent(id: string, editingStudent: Student) {
    this.STUDENTS_DATABASE = this.STUDENTS_DATABASE.map((student) =>
      student.id === id ? {...editingStudent, id} : student
    )
    return editingStudent
  }
}
