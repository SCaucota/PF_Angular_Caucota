import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserActions } from './user.actions';
import { UsersService } from '../../../../core/services/users/users.service';
import { User } from '../models/user';


@Injectable()
export class UserEffects {

  loadUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.loadUsers),
      concatMap(() =>
        this.usersService.getUsers().pipe(
          map(data => UserActions.loadUsersSuccess({ data })),
          catchError(error => of(UserActions.loadUsersFailure({ error }))))
      )
    );
  });

  userById$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.userById),
      switchMap(action =>
        this.usersService.getUserById(action.id).pipe(
          map(data => UserActions.userByIdSuccess({ data })),
          catchError(error => of(UserActions.userByIdFailure({ error }))))
      )
    );
  });

  addUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.addUser),
      concatMap(action => 
        this.usersService.addUser(action.data).pipe(
          map((data) => UserActions.addUserSuccess({ data })),
          catchError(error => of(UserActions.addUserFailure({ error })))
        )
      )
    )
  })

  deleteUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.deleteUser),
      concatMap(action =>
        this.usersService.deleteUser(action.id).pipe(
          map((data) => UserActions.deleteUserSuccess({ data })),
          catchError(error => of(UserActions.deleteUserFailure({ error })))
        )
      )
    )
  })

  editUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.editUser),
      concatMap(action => 
        this.usersService.editUser(action.id, action.editingUser).pipe(
          map((data) =>  UserActions.editUserSuccess({ id: data.id, editingUser: data })),
          catchError(error => of(UserActions.editUserFailure({ error })))
        )
      )
    )
  })

  constructor(private actions$: Actions, private usersService: UsersService) {}
}
