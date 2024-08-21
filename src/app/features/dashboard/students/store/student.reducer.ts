import { createFeature, createReducer, on } from '@ngrx/store';
import { StudentActions } from './student.actions';
import { Student } from '../models/student';
import { Course } from '../../courses/models/course';

export const studentFeatureKey = 'student';

export interface State {
  isLoadingStudents: boolean;
  students: Student[];
  coursesStudent: Course[];
  singleStudent: Student;
  error: unknown
}

export const initialState: State = {
  isLoadingStudents: false,
  students: [],
  coursesStudent: [],
  singleStudent: {} as Student,
  error: null
};

export const reducer = createReducer(
  initialState,
  on(StudentActions.loadStudents, state => ({
    ...state,
    isLoadingStudents: true,
  })),

  on(StudentActions.loadStudentsSuccess, (state, action) => ({
    ...state,
    isLoadingStudents: false,
    students: action.data,
    singleStudent: {} as Student,
    coursesStudent: []
  })),

  on(StudentActions.loadStudentsFailure, (state, action) => ({
    ...state,
    isLoadingStudents: false,
    error: action.error
  })),

  on(StudentActions.loadCoursesStudentSuccess, (state, action) => ({
    ...state,
    coursesStudent: action.data
  })),

  on(StudentActions.loadCoursesStudentFailure, (state, action) => ({
    ...state,
    coursesStudent: [],
    error: action.error
  })),

  on(StudentActions.clearCourses, (state, action) => ({
    ...state,
    coursesStudent: [],
    error: null
  })),

  on(StudentActions.addStudentSuccess, (state, action) => ({
    ...state,
    students: [...state.students, action.data],
    error: null
  })),

  on(StudentActions.addStudentFailure, (state, action) => ({
    ...state,
    students: [],
    error: action.error
  })),

  on(StudentActions.deleteStudentSuccess, (state, action) => ({
    ...state,
    students: state.students.filter(student => student.id !== action.data.id),
    singleStudent: {} as Student,
    error: null
  })),

  on(StudentActions.deleteStudentFailure, (state, action) => ({
    ...state,
    students: [],
    error: action.error
  })),

  on(StudentActions.editStudentSuccess, (state, action) => ({
    ...state,
    students: state.students.map((student) => 
      student.id === action.id ? {...student, ...action.editingStudent} : student
    ),
    error: null
  })),

  on(StudentActions.editStudentFailure, (state, action) => ({
    ...state,
    students: [],
    error: action.error
  })),

  on(StudentActions.studentByIdSuccess, (state, action) => ({
    ...state,
    singleStudent: action.data,
    error: null
  })),

  on(StudentActions.studentByIdFailure, (state, action) => ({
    ...state,
    singleStudent: {} as Student,
    students: [],
    error: action.error
  })),

  on(StudentActions.unregisterStudentSuccess, (state, action) => ({
    ...state,
    students: state.students.map(student =>
      student.id === action.studentId
        ? {
            ...student,
            courses: student.courses.filter(course => course !== action.courseId)
          }
        : student
    ),
    singleStudent: state.singleStudent.id === action.studentId
      ? {
          ...state.singleStudent,
          courses: state.singleStudent.courses.filter(course => course !== action.courseId)
        }
      : state.singleStudent
  })),

  on(StudentActions.unregisterStudentFailure, (state, action) => ({
    ...state,
    singleStudent: {} as Student,
    students: [],
    error: action.error
  })),

  on(StudentActions.addCourseToStudentSuccess, (state, action) => {
    const updatedStudents = state.students.map(student => 
      student.id === action.studentId 
        ? { ...student, courses: [...student.courses, action.courseId] }
        : student
    );
  
    const updatedSingleStudent = state.singleStudent.id === action.studentId 
      ? { ...state.singleStudent, courses: [...state.singleStudent.courses, action.courseId] }
      : state.singleStudent;
  
    return {
      ...state,
      students: updatedStudents,
      singleStudent: updatedSingleStudent,
      error: null
    };
  }),

  on(StudentActions.addCourseToStudentFailure, (state, action) => ({
    ...state,
    singleStudent: {} as Student,
    students: [],
    error: action.error
  })),


  on(StudentActions.resetStudentState, () => initialState)
);

export const studentFeature = createFeature({
  name: studentFeatureKey,
  reducer,
});

