import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Course } from '../../../features/dashboard/courses/models/course';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  URL_BASE: string = "http://localhost:3000/courses"

  constructor(private httpClient: HttpClient) {}
  
  getCourses(): Observable<Course[]> {
    return this.httpClient.get<Course[]>(this.URL_BASE)
  }

  getCourseById(id: string): Observable<Course> {
    return this.httpClient.get<Course>(`${this.URL_BASE}/${id}`)
  }

  addCourse(course: Course): Observable<Course> {
    const modifiedCourse = {
      ...course,
      name: course.name.toUpperCase(),
      description: course.description.toLocaleLowerCase(),
      students: []
    }

    return this.httpClient.post<Course>(this.URL_BASE, modifiedCourse)
  }

  deleteCourse(id: string): Observable<Course> {
    return this.httpClient.delete<Course>(`${this.URL_BASE}/${id}`)
  }

  editCourse(id: string, editingCourse: Course, students: any[]): Observable<Course> {
    const course = {
      ...editingCourse,
      name: editingCourse.name.toUpperCase(),
      description: editingCourse.description.toLowerCase(),
      students: students
    }

    return this.httpClient.put<Course>(`${this.URL_BASE}/${id}`, course)
  }

  deleteStudentFromCourse(courseId: string, studentId: string): Observable<any> {
    return this.getCourseById(courseId).pipe(
      switchMap(course => {
        const updatedStudents = course.students.filter(student => student !== studentId);

        return this.httpClient.patch<any>(`${this.URL_BASE}/${courseId}`, {students: updatedStudents})
      })
    )
  }

  addStudentToCourse(studentId: string, courseId: string): Observable<any>{
    return this.getCourseById(courseId).pipe(
      switchMap(course => {
        const students = course.students;
        const updatedStudents = [...students, studentId]

        return this.httpClient.patch<any>(`${this.URL_BASE}/${courseId}`, {students: updatedStudents})
      })
    )
  }
}
