import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Lesson } from '../models/lesson';

export const LessonActions = createActionGroup({
  source: 'Lesson',
  events: {
    'Load Lessons': emptyProps(),
    'Load Lessons Success': props<{ data: Lesson[] }>(),
    'Load Lessons Failure': props<{ error: unknown }>(),
    'Lesson By Id': props<{ id: string }>(),
    'Lesson By Id Success': props<{ data: Lesson }>(),
    'Lesson By Id Failure': props<{ error: unknown}>(),
    'Add Lesson': props<{ lesson: Lesson }>(),
    'Add Lesson Success': props<{ lesson: Lesson }>(),
    'Add Lesson Failure': props<{ error: unknown }>(),
    'Delete Lesson': props<{ id: string }>(),
    'Delete Lesson Success': props<{ data: Lesson }>(),
    'Delete Lesson Failure': props<{ error: unknown }>(),
    'Edit Lesson': props<{ id: string, editingLesson: Lesson }>(),
    'Edit Lesson Success': props<{ id: string, editingLesson: Lesson }>(),
    'Edit Lesson Failure': props<{ error: unknown }>(),
    'Reset Lessons State': emptyProps()
  }
});
