import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { Student } from '../../../features/dashboard/students/models/student';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  URL_BASE: string = "http://localhost:3000/students"

  constructor(private httpClient: HttpClient) {}
  
  getStudents(): Observable<Student[]> {
    return this.httpClient.get<Student[]>(`${this.URL_BASE}`);
  }

  getStudentById(id: string): Observable<Student> {
    return this.httpClient.get<Student>(`${this.URL_BASE}/${id}`)
  }

  addStudent(student: Student): Observable<Student> {
    const modifiedStudent = {
      ...student,
      name: student.name.toUpperCase(),
      surname: student.surname.toUpperCase(),
      courses: []
    }

    return this.httpClient.post<Student>(this.URL_BASE, modifiedStudent);
  }

  deleteStudent(id: string): Observable<Student> {
    return this.httpClient.delete<Student>(`${this.URL_BASE}/${id}`)
  }

  editStudent(id: string, courses: any[], editingStudent: Student): Observable<Student> {
    const student = {
      ...editingStudent,
      name: editingStudent.name.toUpperCase(),
      surname: editingStudent.surname.toUpperCase(),
      courses: courses
    }

    return this.httpClient.put<Student>(`${this.URL_BASE}/${id}`, student);
  }

  unregisterStudent(courseId: string, studentId: string): Observable<any> {
   return this.getStudentById(studentId).pipe(
    switchMap(student => {
      const updatedCourses = student.courses.filter(course => course !== courseId);
      return this.httpClient.patch<any>(`${this.URL_BASE}/${studentId}`, {courses: updatedCourses})
    })
   )
  }

  addCourseToStudent(courseId: string, studentId: string): Observable<any> {
    return this.getStudentById(studentId).pipe(
      switchMap(student => {
        const courses = student.courses;
        const updatedCourses = [...courses, courseId]

        return this.httpClient.patch<any>(`${this.URL_BASE}/${studentId}`, {courses: updatedCourses})
      })
    )
  }
}
