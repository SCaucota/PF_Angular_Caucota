import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Lesson } from '../../../features/dashboard/lessons/models/lesson';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LessonsService {

  URL_BASE: string = "http://localhost:3000/lessons"

  constructor(private httpClient: HttpClient) {}

  getLessons(): Observable<Lesson[]> {
    return this.httpClient.get<Lesson[]>(this.URL_BASE);
  }

  getLessonById(id: string): Observable<Lesson> {
    return this.httpClient.get<Lesson>(`${this.URL_BASE}/${id}`)
  }

  addLesson(lesson: Lesson) {
    const modifiedLesson = {
      ...lesson,
      name: lesson.name.toUpperCase(),
      courseTitle: lesson.courseTitle.toUpperCase()
    }

    return this.httpClient.post(this.URL_BASE, modifiedLesson);
  }

  deleteLesson(id: string) {
    return this.httpClient.delete(`${this.URL_BASE}/${id}`)
  }

  editLesson(id: string, editingLesson: Lesson) {

    const lesson = {
      ...editingLesson,
      name: editingLesson.name.toUpperCase(),
      courseTitle: editingLesson.courseTitle.toUpperCase()
    }

    return this.httpClient.put(`${this.URL_BASE}/${id}`, lesson);
  }
}
