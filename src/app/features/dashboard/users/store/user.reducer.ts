import { createFeature, createReducer, on } from '@ngrx/store';
import { UserActions } from './user.actions';
import { User } from '../models/user';

export const userFeatureKey = 'user';

export interface State {
  isLoadingUsers: boolean;
  users: User[];
  singleUser: User;
  error: unknown
}

export const initialState: State = {
  isLoadingUsers: false,
  users: [],
  singleUser: {} as User,
  error: null
};

export const reducer = createReducer(
  initialState,
  on(UserActions.loadUsers, state => ({
    ...state,
    isLoadingUsers: true,
    error: null
  })),

  on(UserActions.loadUsersSuccess, (state, action) => ({
    ...state,
    isLoadingUsers: false,
    users: action.data,
    error: null
  })),

  on(UserActions.loadUsersFailure, (state, action) => ({
    ...state,
    isLoadingUsers: false,
    error: action.error
  })),
  
  on(UserActions.addUserSuccess, (state, action) => ({
    ...state,
    users: [...state.users, action.data],
    error: null
  })),

  on(UserActions.addUserFailure, (state, action) => ({
    ...state,
    users: [],
    error: action.error
  })),

  on(UserActions.deleteUserSuccess, (state, action) => ({
    ...state,
    users: state.users.filter(user => user.id !== action.data.id),
    error: null
  })),

  on(UserActions.deleteUserFailure, (state, action) => ({
    ...state,
    users: [],
    error: action.error
  })),

  on(UserActions.editUserSuccess, (state, action) => ({
    ...state,
    users: state.users.map((user) =>
      user.id === action.id ? {...user, ...action.editingUser} : user
    ),
    error: null
  })),

  on(UserActions.editUserFailure, (state, action) => ({
    ...state,
    users: [],
    error: action.error
  })),

  on(UserActions.userByIdSuccess, (state, action) => ({
    ...state,
    singleUser: action.data,
    error: null
  })),

  on(UserActions.userByIdFailure, (state, action) => ({
    ...state,
    singleUser: {} as User,
    error: action.error
  })),

  on(UserActions.resetUserState, () => initialState)
);

export const userFeature = createFeature({
  name: userFeatureKey,
  reducer,
});

