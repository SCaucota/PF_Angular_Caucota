import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../../../features/dashboard/users/models/user';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Set Auths User': emptyProps(),
    'Set Auths User Success': props<{ data: User }>(),
    'Set Auths User Failure': props<{ error: unknown }>(),
    'Unset Auths User': emptyProps()
  }
});
