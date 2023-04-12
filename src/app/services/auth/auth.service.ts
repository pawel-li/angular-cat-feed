import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this._isLoggedIn$.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('auth');
    this._isLoggedIn$.next(!!token);
  }

  public login(username: string, password: string): Observable<void> {
    return this.http.post('login', { username, password }).pipe(
      map((response: any) => {
        this._isLoggedIn$.next(true);
        localStorage.setItem('auth', response.token);
      })
    );
  }

  public logout(): void {
    this._isLoggedIn$.next(false);
    localStorage.removeItem('auth');
    this.router.navigate(['/']);
  }
}