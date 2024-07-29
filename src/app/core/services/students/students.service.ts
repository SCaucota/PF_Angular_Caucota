import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Student } from '../../../features/dashboard/students/models/student';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  private STUDENTS_DATABASE: Student[] = [
    { id: '1', name: 'JUAN', surname: 'PÉREZ', courses: ['1', '2'] },
    { id: '2', name: 'MARÍA', surname: 'GÓMEZ', courses: ['2', '3'] },
    { id: '3', name: 'CARLOS', surname: 'LOPEZ', courses: ['3', '4'] },
    { id: '4', name: 'ANA', surname: 'FERNÁNDEZ', courses: ['4', '5'] },
    { id: '5', name: 'LUIS', surname: 'MARTÍNEZ', courses: ['5', '6'] },
    { id: '6', name: 'SOFÍA', surname: 'GARCÍA', courses: ['6'] },
    { id: '7', name: 'MIGUEL', surname: 'RODRÍGUEZ', courses: ['7'] },
    { id: '8', name: 'ELENA', surname: 'MORALES', courses: ['8'] },
    { id: '9', name: 'DAVID', surname: 'NÚÑEZ', courses: ['9'] },
    { id: '10', name: 'LAURA', surname: 'RAMÍREZ', courses: ['10'] },
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

    this.STUDENTS_DATABASE.push({
      id: newId,
      name: student.name.toUpperCase(),
      surname: student.surname.toUpperCase(),
      courses: []
    });
    return student
  }

  deleteStudent(id: string) {
    this.STUDENTS_DATABASE = this.STUDENTS_DATABASE.filter(student => student.id !== id)
  }

  editStudent(id: string, courses: any, editingStudent: Student) {
    console.log(editingStudent)
    this.STUDENTS_DATABASE = this.STUDENTS_DATABASE.map((student) =>
      student.id === id ? {...editingStudent, id, courses} : student
    )
    return editingStudent
  }

  unregisterStudent(courseId: string) {
    this.STUDENTS_DATABASE = this.STUDENTS_DATABASE.map((student) =>{
      return {
        ...student,
        courses: student.courses.filter((course) => course !== courseId),
      }
    })
  }

  addCourseToStudent(courseId: string, studentId: string) {
    const student = this.STUDENTS_DATABASE.find(student => student.id === studentId)
    student?.courses.push(courseId)
  }
}
