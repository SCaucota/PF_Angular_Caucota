import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Inscription } from '../models/inscription';
import { Course } from '../../courses/models/course';
import { Student } from '../../students/models/student';

export const InscriptionActions = createActionGroup({
  source: 'Inscription',
  events: {
    'Load Inscriptions': emptyProps(),
    'Load Inscriptions Success': props<{ data: Inscription[] }>(),
    'Load Inscriptions Failure': props<{ error: unknown }>(),
    'Inscription By Id': props<{ id: string }>(),
    'Inscription By Id Success': props<{ data: Inscription }>(),
    'Inscription By Id Failure': props<{ error: unknown}>(),
    'Clear Inscription State': emptyProps(),
    'Load Courses Form': emptyProps(),
    'Load Courses Form Success': props<{ data: Course[] }>(),
    'Load Courses Form Failure': props<{ error: unknown }>(),
    'Load Students Form': emptyProps(),
    'Load Students Form Success': props<{ data: Student[] }>(),
    'Load Students Form Failure': props<{ error: unknown }>(),
    'Add Inscription': props<{ data: Inscription }>(),
    'Add Inscription Success': props<{ data: Inscription }>(),
    'Add Inscription Failure': props<{ error: unknown }>(),
    'Delete Inscription': props<{ id: string }>(),
    'Delete Inscription Success': props<{ data: Inscription }>(),
    'Delete Inscription Failure': props<{ error: unknown }>(),
    'Edit Inscription': props<{ id: string, newInscription: Inscription, oldInscription: Inscription }>(),
    'Edit Inscription Success': props<{ id: string, editingInscription: Inscription }>(),
    'Edit Inscription Failure': props<{ error: unknown }>(),
    'Cancel Inscription': props<{ courseId: string, studentId: string }>(),
    'Cancel Inscription Success': props<{ courseId: string, studentId: string }>(),
    'Cancel Inscription Failure': props<{ error: unknown }>(),
    'Reset Inscription State': emptyProps()
  }
});
