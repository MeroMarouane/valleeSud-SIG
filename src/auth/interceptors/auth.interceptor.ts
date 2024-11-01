import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ACCESS_TOKEN } from '../constants';
import { AuthFacade } from '../store/auth.facade';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authFacade: AuthFacade,
  ) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);

    req = req.clone({url: req.url.substring(0, req.url.length-1)});
    if (accessToken) {
      console.log('req: ',req);
      if(req.url.lastIndexOf('/') === req.url.length-1){
      }
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` }
      });
    }

    return next.handle(req).pipe(s => this.handleErrors(s, req.url));
  }

  private handleErrors(
    source: Observable<HttpEvent<unknown>>,
    urlPath: string
  ): Observable<HttpEvent<unknown>> {
    return source.pipe(
      catchError((error: HttpErrorResponse) => {
        // try to avoid errors on logout
        // therefore we check the url path of '/auth/'
        if (error.status === 401 && !urlPath.includes('/auth/')) {
          return this.handle401();
        }

        // rethrow error
        return throwError(() => error);
      })
    );
  }

  private handle401() {
    this.authFacade.logout();
    return EMPTY;
  }
}
