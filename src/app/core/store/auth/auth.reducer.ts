import { createFeature, createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import { User } from '../../../features/dashboard/users/models/user';

export const authFeatureKey = 'auth';

export interface State {
  authUser: User | null;
}

export const initialState: State = {
  authUser: null
};

export const reducer = createReducer(
  initialState,
  
  on(AuthActions.setAuthsUser, (state, action) => ({
    ...state,
    authUser: null
  })),
  on(AuthActions.setAuthsUserSuccess, (state, action) => ({
    ...state,
    authUser: action.data
  })),
  on(AuthActions.setAuthsUserFailure, (state, action) => state),
  on(AuthActions.unsetAuthsUser, () => initialState)
);

export const authFeature = createFeature({
  name: authFeatureKey,
  reducer,
});

