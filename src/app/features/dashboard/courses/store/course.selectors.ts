import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCourse from './course.reducer';

export const selectCourseState = createFeatureSelector<fromCourse.State>(
  fromCourse.courseFeatureKey
);

export const selectCourses = createSelector(
  selectCourseState,
  (state) => state.courses
)

export const selectIsLoadingCourses = createSelector(
  selectCourseState,
  (state) => state.isLoadingCourses
)

export const selectCoursesError = createSelector(
  selectCourseState,
  (state) => state.error
)

export const selectSingleCourse = createSelector(
  selectCourseState,
  (state) => state.singleCourse
)

export const selectStudentsForm = createSelector(
  selectCourseState,
  (state) => state.studentsForm
)