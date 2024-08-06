import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { Student } from '../../../features/dashboard/students/models/student';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  constructor(private httpClient: HttpClient) {}
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
    /* return of([...this.STUDENTS_DATABASE]) */
    return this.httpClient.get<Student[]>('http://localhost:3000/students')
  }

  getStudentById(id: string): Observable<Student> {
    /* return this.STUDENTS_DATABASE.find(student => student.id === id) */
    return this.httpClient.get<Student>('http://localhost:3000/students/' + id)
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
    this.STUDENTS_DATABASE = this.STUDENTS_DATABASE.map((student) =>
      student.id === id ? {...editingStudent, id, courses} : student
    )
    return editingStudent
  }

  unregisterStudent(courseId: string, studentId: string) {
    /* console.log(courseId, studentId)
    const student = this.STUDENTS_DATABASE.find(student => student.id === studentId);
    if(student) {
      const courses = student?.courses.filter((course) => course !== courseId);
      student.courses = courses
    } */
   return this.getStudentById(studentId).pipe(
    switchMap(student => {
      const updatedCourses = student.courses.filter(course => course !== courseId);
      return this.httpClient.patch<void>(`http://localhost:3000/students/${studentId}`, {courses: updatedCourses})
    })
   )
  }

  addCourseToStudent(courseId: string, studentId: string) {
    /* const student = this.STUDENTS_DATABASE.find(student => student.id === studentId)
    student?.courses.push(courseId) */
    return this.getStudentById(studentId).pipe(
      switchMap(student => {
        const courses = student.courses;
        const updatedCourses = {...courses, courseId}

        return this.httpClient.patch<void>(`http://localhost:3000/students/${courseId}`, {students: updatedCourses})
      })
    )
  }
}
