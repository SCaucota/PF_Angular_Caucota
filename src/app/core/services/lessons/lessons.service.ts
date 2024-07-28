import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Lesson } from '../../../features/lessons/models/lesson';

@Injectable({
  providedIn: 'root'
})
export class LessonsService {
  private LESSONS_DATABASE: Lesson[] = [
    { id: '1', name: 'MODULES', date: new Date('2024-10-06'), courseTitle: 'ANGULAR', status: true },
    { id: '2', name: 'HOOKS', date: new Date('2024-11-05'), courseTitle: 'REACT', status: true },
    { id: '3', name: 'EXPRESS.JS BASICS', date: new Date('2024-09-20'), courseTitle: 'NODE.JS', status: false },
    { id: '4', name: 'OOP BASICS', date: new Date('2024-09-10'), courseTitle: 'JAVA', status: true },
    { id: '5', name: 'SWIFT BASICS', date: new Date('2024-12-05'), courseTitle: 'SWIFT', status: false },
    { id: '6', name: 'ROUTING IN RAILS', date: new Date('2024-09-25'), courseTitle: 'RUBY ON RAILS', status: true },
    { id: '7', name: 'COMPONENTS', date: new Date('2024-10-13'), courseTitle: 'ANGULAR', status: true },
    { id: '8', name: 'STATE MANAGEMENT', date: new Date('2024-11-12'), courseTitle: 'REACT', status: true },
    { id: '9', name: 'DATABASE INTEGRATION', date: new Date('2024-10-02'), courseTitle: 'NODE.JS', status: true },
    { id: '10', name: 'WEB FRAMEWORKS', date: new Date('2024-09-05'), courseTitle: 'PYTHON', status: true },
    { id: '11', name: 'ADVANCED OOP', date: new Date('2024-10-01'), courseTitle: 'JAVA', status: false },
    { id: '12', name: 'ASP.NET CORE', date: new Date('2024-11-01'), courseTitle: 'C#', status: true },
    { id: '13', name: 'VUE ROUTER', date: new Date('2024-11-20'), courseTitle: 'VUE.JS', status: true },
    { id: '14', name: 'ACTIVE RECORD', date: new Date('2024-10-10'), courseTitle: 'RUBY ON RAILS', status: true },
    { id: '15', name: 'DJANGO TEMPLATES', date: new Date('2025-01-05'), courseTitle: 'DJANGO', status: true }
  ];
  

  getLessons(): Observable<Lesson[]> {
    return of(this.LESSONS_DATABASE);
  }

  getLessonById(id: string) {
    return this.LESSONS_DATABASE.find(lesson => lesson.id === id)
  }

  addLesson(lesson: Lesson) {
    const maxId = Math.max(...this.LESSONS_DATABASE.map(a => +a.id));
    const newId = (maxId + 1).toString();

    this.LESSONS_DATABASE.push({
      id: newId,
      name: lesson.name.toUpperCase(),
      date: lesson.date,
      courseTitle: lesson.courseTitle.toUpperCase(),
      status: lesson.status
    });
    return lesson
  }

  deleteLesson(id: string) {
    this.LESSONS_DATABASE = this.LESSONS_DATABASE.filter(lesson => lesson.id !== id)
  }

  editLesson(id: string, editingLesson: Lesson) {
    this.LESSONS_DATABASE = this.LESSONS_DATABASE.map((lesson) =>
      lesson.id === id
      ? 
        {...editingLesson,
          id,
          name: editingLesson.name.toUpperCase(),
          courseTitle: editingLesson.courseTitle.toUpperCase()
        }
      : lesson
    )
    return editingLesson
  }
}
