import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromInscription from './inscription.reducer';

export const selectInscriptionState = createFeatureSelector<fromInscription.State>(
  fromInscription.inscriptionFeatureKey
);

export const selectInscriptions = createSelector(
  selectInscriptionState,
  (state) => state.inscriptions
)

export const selectIsLoadingInscriptions = createSelector(
  selectInscriptionState,
  (state) => state.isLoadingInscriptions
)

export const selectInscriptionsError = createSelector(
  selectInscriptionState,
  (state) => state.error
)

export const selectSingleInscription = createSelector(
  selectInscriptionState,
  (state) => state.singleInscription
)

export const selectCourseInscription = createSelector(
  selectInscriptionState,
  (state) => state.course
)

export const selectStudentInscription = createSelector(
  selectInscriptionState,
  (state) => state.student
)