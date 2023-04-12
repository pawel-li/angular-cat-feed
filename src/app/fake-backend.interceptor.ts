import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export const JWT_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4MTE5NjA1OCwiaWF0IjoxNjgxMTk2MDU4fQ.ul1aakUVbhB9mfZssr058llE9XWIsV2_a9MjBMRbAU8';

const HTTP_LOGIN_RES = {
  status: 200,
  body: {
    id: '1',
    username: 'pawelliz',
    token: JWT_TOKEN,
  },
}

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    
    const { url, method } = request;
    if (url.endsWith('login') && method === 'POST') return this.handleLogin();
    return next.handle(request);
  }

  private handleLogin = (): Observable<HttpEvent<unknown>> => of(new HttpResponse(HTTP_LOGIN_RES));

}

export const FakeBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true,
};