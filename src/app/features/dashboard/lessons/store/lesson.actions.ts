import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Lesson } from '../models/lesson';

export const LessonActions = createActionGroup({
  source: 'Lesson',
  events: {
    'Load Lessons': emptyProps(),
    'Load Lessons Success': props<{ data: Lesson[] }>(),
    'Load Lessons Failure': props<{ error: unknown }>(),
  }
});
