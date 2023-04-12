import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export const AuthGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return new Observable<boolean>(obs => {
    auth.isLoggedIn$.subscribe((isLoggedIn) => {
      if (!isLoggedIn) router.navigateByUrl('/login');
      return obs.next(isLoggedIn)
    })
  })
}