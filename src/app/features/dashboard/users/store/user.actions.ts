import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../models/user';

export const UserActions = createActionGroup({
  source: 'User',
  events: {
    'Load Users': emptyProps(),
    'Load Users Success': props<{ data: User[] }>(),
    'Load Users Failure': props<{ error: unknown }>(),
    'User By Id': props<{ id: string }>(),
    'User By Id Success': props<{ data: User }>(),
    'User By Id Failure': props<{ error: unknown}>(),
    'Add User': props<{ data: User }>(),
    'Add User Success': props<{ data: User }>(),
    'Add User Failure': props<{ error: unknown }>(),
    'Delete User': props<{ id: string }>(),
    'Delete User Success': props<{ data: User }>(),
    'Delete User Failure': props<{ error: unknown }>(),
    'Edit User': props<{ id: string, editingUser: User }>(),
    'Edit User Success': props<{ id: string, editingUser: User }>(),
    'Edit User Failure': props<{ error: unknown }>(),
    'Reset User State': emptyProps()
  }
});
