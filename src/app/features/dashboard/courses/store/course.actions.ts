import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Course } from '../models/course';
import { Student } from '../../students/models/student';

export const CourseActions = createActionGroup({
  source: 'Course',
  events: {
    'Load Courses': emptyProps(),
    'Load Courses Success': props<{ data: Course[] }>(),
    'Load Courses Failure': props<{ error: unknown }>(),
    'Load Students Form': props<{ id: string }>(),
    'Load Students Form Success': props<{ data: Student[] }>(),
    'Load Students Form Failure': props<{ error: unknown }>(),
    'Clear Students': emptyProps(),
    'Course By Id': props<{ id: string }>(),
    'Course By Id Success': props<{ data: Course }>(),
    'Course By Id Failure': props<{ error: unknown}>(),
    'Add Course': props<{ data: Course }>(),
    'Add Course Success': props<{ data: Course }>(),
    'Add Course Failure': props<{ error: unknown }>(),
    'Delete Course': props<{ id: string }>(),
    'Delete Course Success': props<{ data: Course }>(),
    'Delete Course Failure': props<{ error: unknown }>(),
    'Edit Course': props<{ id: string, editingStudent: Course, students: any[] }>(),
    'Edit Course Success': props<{ id: string, editingStudent: Course, students: any[] }>(),
    'Edit Course Failure': props<{ error: unknown }>(),
    'Delete Student From Course': props<{ courseId: string, studentId: string }>(),
    'Delete Student From Course Success': props<{ courseId: string, studentId: string }>(),
    'Delete Student From Course Failure': props<{ error: unknown }>(),
    'Reset Course State': emptyProps()
  }
});
