import { createFeature, createReducer, on } from '@ngrx/store';
import { InscriptionActions } from './inscription.actions';
import { Inscription } from '../models/inscription';
import { Student } from '../../students/models/student';
import { Course } from '../../courses/models/course';

export const inscriptionFeatureKey = 'inscription';

export interface State {
  isLoadingInscriptions: boolean;
  inscriptions: Inscription[];
  singleInscription: Inscription;
  error: unknown;
  student: Student | null;
  course: Course | null;
}

export const initialState: State = {
  isLoadingInscriptions: false,
  inscriptions: [],
  singleInscription: {} as Inscription,
  error: null,
  student: {} as Student,
  course: {} as Course
};

export const reducer = createReducer(
  initialState,
  on(InscriptionActions.loadInscriptions, state => ({
    ...state,
    isLoadingInscriptions: true
  })),

  on(InscriptionActions.loadInscriptionsSuccess, (state, action) => ({
    ...state,
    isLoadingInscriptions: false,
    inscriptions: action.data,
    singleInscription: {} as Inscription,
    error: null,
    student: {} as Student,
    course: {} as Course
  })),

  on(InscriptionActions.loadInscriptionsFailure, (state, action) => ({
    ...state,
    isLoadingInscriptions: false,
    error: action.error
  })),

  on(InscriptionActions.loadInscriptionDetailsSuccess, (state, action) => ({
    ...state,
    student: action.student,
    course: action.course,
    error: null
  })),

  on(InscriptionActions.loadInscriptionDetailsFailure, (state, action) => ({
    ...state,
    student: {} as Student,
    course: {} as Course,
    error: action.error
  })),

  on(InscriptionActions.clearInscriptionDetails, (state, action) => ({
    ...state,
    student: {} as Student,
    course: {} as Course,
    error: null
  })),

  on(InscriptionActions.addInscriptionSuccess, (state, action) => ({
    ...state,
    inscriptions: [...state.inscriptions, action.data],
    error: null
  })),

  on(InscriptionActions.addInscriptionFailure, (state, action) => ({
    ...state,
    inscriptions: [],
    error: action.error
  })),

  on(InscriptionActions.deleteInscriptionSuccess, (state, action) => ({
    ...state,
    inscriptions: state.inscriptions.filter(inscription => inscription.id !== action.data.id),
    error: null
  })),

  on(InscriptionActions.deleteInscriptionFailure, (state, action) => ({
    ...state,
    inscriptions: [],
    error: action.error
  })),

  on(InscriptionActions.editInscriptionSuccess, (state, action) => ({
    ...state,
    inscriptions: state.inscriptions.map((inscription) => 
      inscription.id === action.id ? {...inscription, ...action.editingInscription} : inscription
    ),
    error: null
  })),

  on(InscriptionActions.editInscriptionFailure, (state, action) => ({
    ...state,
    inscriptions: [],
    error: action.error
  })),

  on(InscriptionActions.inscriptionByIdSuccess, (state, action) => ({
    ...state,
    singleInscription: action.data,
    error: null
  })),

  on(InscriptionActions.inscriptionByIdFailure, (state, action) => ({
    ...state,
    singleInscription: {} as Inscription,
    inscriptions: [],
    error: action.error
  })),

  on(InscriptionActions.cancelInscriptionSuccess, (state, action) => ({
    ...state,
    inscriptions: state.inscriptions.map(inscription =>
      inscription.courseId === action.courseId && inscription.studentId === action.studentId
        ? {...inscription, status: false}
        : inscription
    ),
    error: null
  })),

  on(InscriptionActions.cancelInscriptionFailure, (state, action) => ({
    ...state,
    inscriptions: [],
    error: action.error
  })),

  on(InscriptionActions.resetInscriptionState, () => initialState)
);

export const inscriptionFeature = createFeature({
  name: inscriptionFeatureKey,
  reducer,
});

