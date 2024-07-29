import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Course } from '../../../features/dashboard/courses/models/course';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private COURSES_DATABASE: Course[] = [
    {
      id:   '1',
      name: 'ANGULAR',
      description: 'curso inicial de Angular',
      startDate: new Date('2024-10-05'),
      endDate: new Date('2024-12-08'),
      time: "08:30 - 10:30"
    },
    {
      id:   '2',
      name: 'REACT',
      description: 'curso avanzado de React',
      startDate: new Date('2024-11-01'),
      endDate: new Date('2025-01-15'),
      time: "16:00 - 18:00"
    },
    {
      id:   '3',
      name: 'NODE.JS',
      description: 'desarrollo backend con Node.js',
      startDate: new Date('2024-09-15'),
      endDate: new Date('2024-11-20'),
      time: "20:30 - 22:30"
    },
    {
      id:   '4',
      name: 'PYTHON',
      description: 'introducción a Python para desarrollo web',
      startDate: new Date('2024-08-10'),
      endDate: new Date('2024-10-25'),
      time: "19:00 - 21:00"
    },
    {
      id:   '5',
      name: 'JAVA',
      description: 'fundamentos de Java para programación orientada a objetos',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2024-12-01'),
      time: "08:00 - 10:00"
    },
    {
      id:   '6',
      name: 'C#',
      description: 'desarrollo de aplicaciones con C# y .NET',
      startDate: new Date('2024-10-15'),
      endDate: new Date('2024-12-15'),
      time: "17:00 - 19:00"
    },
    {
      id:   '7',
      name: 'VUE.JS',
      description: 'desarrollo frontend con Vue.js',
      startDate: new Date('2024-11-05'),
      endDate: new Date('2025-01-10'),
      time: "20:30 - 22:30"
    },
    {
      id:   '8',
      name: 'SWIFT',
      description: 'desarrollo de aplicaciones iOS con Swift',
      startDate: new Date('2024-12-01'),
      endDate: new Date('2025-03-01'),
      time: "10:00 - 12:00"
    },
    {
      id:   '9',
      name: 'RUBY ON NAILS',
      description: 'desarrollo web con Ruby on Rails',
      startDate: new Date('2024-09-20'),
      endDate: new Date('2024-11-30'),
      time: "10:00 - 12:00"
    },
    {
      id:   '10',
      name: 'DJANGO',
      description: 'desarrollo web con Django y Python',
      startDate: new Date('2024-12-05'),
      endDate: new Date('2025-03-10'),
      time: "17:30 - 19:30"
    }
  ];
  

  getCourses(): Observable<Course[]> {
    return of(this.COURSES_DATABASE);
  }

  getCourseById(id: string) {
    return this.COURSES_DATABASE.find(course => course.id === id)
  }

  addCourse(course: Course) {
    const maxId = Math.max(...this.COURSES_DATABASE.map(a => +a.id));
    const newId = (maxId + 1).toString();

    this.COURSES_DATABASE.push({
      id: newId,
      name: course.name.toUpperCase(),
      description: course.description.toLowerCase(),
      startDate: new Date(course.startDate),
      endDate: new Date(course.endDate),
      time: course.time
    });
    return course
  }

  deleteCourse(id: string) {
    this.COURSES_DATABASE = this.COURSES_DATABASE.filter(course => course.id !== id)
  }

  editCourse(id: string, editingCourse: Course) {
    this.COURSES_DATABASE = this.COURSES_DATABASE.map((course) =>
      course.id === id
      ? 
        {...editingCourse,
          id,
          name: editingCourse.name.toUpperCase(),
          description: editingCourse.description.toLowerCase()
        }
      : course
    )
    return editingCourse
  }
}
