import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthService } from './login/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  return authService.getAuthState().pipe(
    map(isLoggedIn => {
      if (isLoggedIn === null) {
        return false; 
      }
      if (!isLoggedIn) {
        return false;
      }
      return true;
    })
  );
};
