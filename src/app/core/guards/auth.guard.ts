import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const isAuthenticated = !!localStorage.getItem('token');

  return isAuthenticated;
};
