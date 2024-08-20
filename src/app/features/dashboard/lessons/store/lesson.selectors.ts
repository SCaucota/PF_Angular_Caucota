import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromLesson from './lesson.reducer';
import { state } from '@angular/animations';

export const selectLessonState = createFeatureSelector<fromLesson.State>(
  fromLesson.lessonFeatureKey
);

export const selectLessons = createSelector(
  selectLessonState,
  (state) => state.lessons
)

export const selectIsLoadingLessons = createSelector(
  selectLessonState,
  (state) => state.isLoadingLessons
)

export const selectLessonsError = createSelector(
  selectLessonState,
  (state) => state.error
)

export const selectSingleLesson = createSelector(
  selectLessonState,
  (state) => state.singlelesson
)

export const selectCoursesForm = createSelector(
  selectLessonState,
  (state) => state.coursesForm
)
