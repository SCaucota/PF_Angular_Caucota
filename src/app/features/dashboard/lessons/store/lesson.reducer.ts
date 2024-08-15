import { createFeature, createReducer, on } from '@ngrx/store';
import { LessonActions } from './lesson.actions';
import { Lesson } from '../models/lesson';

export const lessonFeatureKey = 'lesson';

export interface State {
  isLoadingLessons: boolean;
  lessons: Lesson[];
  error: unknown
}

export const initialState: State = {
  isLoadingLessons: false,
  lessons: [],
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
);

export const lessonFeature = createFeature({
  name: lessonFeatureKey,
  reducer,
});

