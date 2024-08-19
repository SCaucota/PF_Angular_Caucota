import { createFeature, createReducer, on } from '@ngrx/store';
import { CourseActions } from './course.actions';
import { Course } from '../models/course';

export const courseFeatureKey = 'course';

export interface State {
  isLoadingCourses: boolean;
  courses: Course[];
  singleCourse: Course;
  error: unknown
}

export const initialState: State = {
  isLoadingCourses: false,
  courses: [],
  singleCourse: {} as Course,
  error: null
};

export const reducer = createReducer(
  initialState,
  on(CourseActions.loadCourses, state => ({
    ...state,
    isLoadingCourses: true
  })),

  on(CourseActions.loadCoursesSuccess, (state, action) => ({
    ...state,
    isLoadingCourses: false,
    courses: action.data
  })),

  on(CourseActions.loadCoursesFailure, (state, action) => ({
    ...state,
    isLoadingCourses: false,
    error: action.error
  })),

  on(CourseActions.addCourseSuccess, (state, action) => ({
    ...state,
    courses: [...state.courses, action.data],
    error: null
  })),

  on(CourseActions.addCourseFailure, (state, action) => ({
    ...state,
    courses: [],
    error: action.error
  })),

  on(CourseActions.deleteCourseSuccess, (state, action) => ({
    ...state,
    courses: state.courses.filter(course => course.id !== action.data.id),
    error: null
  })),

  on(CourseActions.deleteCourseFailure, (state, action) => ({
    ...state,
    courses: [],
    error: action.error
  })),

  on(CourseActions.editCourseSuccess, (state, action) => ({
    ...state,
    courses: state.courses.map((course) => 
      course.id === action.id ? {...course, ...action.editingStudent} : course
    ),
    error: null
  })),

  on(CourseActions.editCourseFailure, (state, action) => ({
    ...state,
    coures: [],
    error: action.error
  })),

  on(CourseActions.courseByIdSuccess, (state, action) => ({
    ...state,
    singleCourse: action.data,
    error: null
  })),

  on(CourseActions.courseByIdFailure, (state, action) => ({
    ...state,
    singleCourse: {} as Course,
    courses: [],
    error: action.error
  })),

  on(CourseActions.deleteStudentFromCourseSuccess, (state, action) => ({
    ...state,
    courses: state.courses.map(course =>
      course.id === action.courseId
        ? {
          ...course,
          students: course.students.filter(id => id !== action.studentId)
        }
        : course
    ),
    error: null
  })),

  on(CourseActions.deleteStudentFromCourseFailure, (state, action) => ({
    ...state,
    courses: [],
    error: action.error
  })),

  on(CourseActions.addStudentToCourseSuccess, (state, action) => ({
    ...state,
    courses: state.courses.map(course => 
      course.id === action.courseId
        ? {
          ...course,
          students: [...course.students, action.studentId]
        }
        : course
    ),
    error: null
  })),

  on(CourseActions.addStudentToCourseFailure, (state, action) => ({
    ...state,
    courses: [],
    error: action.error
  })),

  on(CourseActions.resetCourseState, () => initialState)
);

export const courseFeature = createFeature({
  name: courseFeatureKey,
  reducer,
});

