import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = sessionStorage.getItem('token');
  const user = sessionStorage.getItem('user');

  if (!token || !user) {
    // router.navigateByUrl('/login');
    // return false;

    // return true;

    const incomingParams = route.queryParams;

    return router.createUrlTree(['/login'], { queryParams: incomingParams });
  }

  return true;
};
