import { createFeature, createReducer, on } from '@ngrx/store';
import { LessonActions } from './lesson.actions';
import { Lesson } from '../models/lesson';

export const lessonFeatureKey = 'lesson';

export interface State {
  isLoadingLessons: boolean;
  lessons: Lesson[];
  singlelesson: Lesson;
  
  error: unknown
}

export const initialState: State = {
  isLoadingLessons: false,
  lessons: [],
  singlelesson: {} as Lesson,
  error: null
};

export const reducer = createReducer(
  initialState,
  on(LessonActions.loadLessons, state => ({
    ...state,
    isLoadingLessons: true
  })),

  on(LessonActions.loadLessonsSuccess, (state, action) => ({
    ...state,
    isLoadingLessons: false,
    lessons: action.data
  })),

  on(LessonActions.loadLessonsFailure, (state, action) => ({
    ...state,
    isLoadingLessons: false,
    error: action.error
  })),

  on(LessonActions.addLessonSuccess, (state, action) => ({
    ...state,
    lessons: [...state.lessons, action.lesson],
    error: null
  })),

  on(LessonActions.deleteLessonSuccess, (state, action) => ({
    ...state,
    lessons: state.lessons.filter(lesson => lesson.id !== action.data.id),
    error: null
  })),

  on(LessonActions.editLessonSuccess, (state, action) => ({
    ...state,
    lessons: state.lessons.map((lesson) =>
      lesson.id === action.id ? {...lesson, ...action.editingLesson} : lesson
    ),
    error: null
  })),

  on(LessonActions.lessonByIdSuccess, (state, action) => ({
    ...state,
    singlelesson: action.data,
    error: null
  }))
);

export const lessonFeature = createFeature({
  name: lessonFeatureKey,
  reducer,
});

