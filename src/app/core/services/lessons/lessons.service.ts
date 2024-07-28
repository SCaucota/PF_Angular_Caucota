import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Lesson } from '../../../features/lessons/models/lesson';

@Injectable({
  providedIn: 'root'
})
export class LessonsService {
  private LESSONS_DATABASE: Lesson[] = [
    { id: '1', name: 'Modules', date: new Date('2024-10-06'), courseTitle: 'Angular' },
    { id: '2', name: 'Hooks', date: new Date('2024-11-05'), courseTitle: 'React' },
    { id: '3', name: 'Express.js Basics', date: new Date('2024-09-20'), courseTitle: 'Node.js' },
    { id: '4', name: 'OOP Basics', date: new Date('2024-09-10'), courseTitle: 'Java' },
    { id: '5', name: 'Swift Basics', date: new Date('2024-12-05'), courseTitle: 'Swift' },
    { id: '6', name: 'Routing in Rails', date: new Date('2024-09-25'), courseTitle: 'Ruby on Rails' },
    { id: '7', name: 'Components', date: new Date('2024-10-13'), courseTitle: 'Angular' },
    { id: '8', name: 'State Management', date: new Date('2024-11-12'), courseTitle: 'React' },
    { id: '9', name: 'Database Integration', date: new Date('2024-10-02'), courseTitle: 'Node.js' },
    { id: '10', name: 'Web Frameworks', date: new Date('2024-09-05'), courseTitle: 'Python' },
    { id: '11', name: 'Advanced OOP', date: new Date('2024-10-01'), courseTitle: 'Java' },
    { id: '12', name: 'ASP.NET Core', date: new Date('2024-11-01'), courseTitle: 'C#' },
    { id: '13', name: 'Vue Router', date: new Date('2024-11-20'), courseTitle: 'Vue.js' },
    { id: '14', name: 'Active Record', date: new Date('2024-10-10'), courseTitle: 'Ruby on Rails' },
    { id: '15', name: 'Django Templates', date: new Date('2025-01-05'), courseTitle: 'Django' }
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
      courseTitle: lesson.courseTitle.toUpperCase()
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
