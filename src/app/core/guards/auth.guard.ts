import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const isAuthenticated = !!localStorage.getItem('token');

  if(!isAuthenticated) {
    const router = new Router();
    router.navigate(['/auth/login']);
    return false
  }

  return true;
};
