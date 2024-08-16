import { ActionReducerMap, State } from '@ngrx/store';
import { authFeature } from './auth/auth.reducer';

export interface RootState {
   auth: any;
}

export const rootReducer: ActionReducerMap<RootState> = {
   auth: authFeature.reducer
};