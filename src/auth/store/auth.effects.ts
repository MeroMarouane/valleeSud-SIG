import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, exhaustMap, finalize, map, tap } from 'rxjs/operators';

import { AuthService } from '../auth.service';
import { ACCESS_TOKEN } from '../constants';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loginRequest),
      exhaustMap((credentials) =>
        this.authService.login(credentials.email, credentials.password).pipe(
          map((data) => {
            // save tokens
            localStorage.setItem(ACCESS_TOKEN, data?.authorisation?.token);
            // trigger login success action
            return AuthActions.loginSuccess();
          }),
          catchError((error) => {
            return of(AuthActions.loginFailure({ error }));
          })
        )
      )
    );
  });

  onLoginSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      map(() => {
        // redirect to return url or home
        this.router.navigateByUrl(
          this.activatedRoute.snapshot.queryParams['returnUrl'] || '/'
        );
        return AuthActions.getAuthUserRequest();
      })
    );
  });

  onloginFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.loginFailure),
        tap((err) => {
          this.toastr.error(err.error.message);
          localStorage.removeItem(ACCESS_TOKEN);
        })
      );
    },
    { dispatch: false }
  );

  logout$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.logout),
        exhaustMap(() => {
          this.router.navigateByUrl('/');
          this.authService.logout();
          return of().pipe(finalize(() => console.log('user logged out')));
        })
      );
    },
    { dispatch: false }
  );

  getUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.getAuthUserRequest),
      exhaustMap(() =>
        this.authService.getAuthUser().pipe(
          map((user) => AuthActions.getAuthUserSuccess({ user })),
          catchError(() => of(AuthActions.getAuthUserFailure()))
        )
      )
    );
  });

  constructor(
    private router: Router,
    private actions$: Actions,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private readonly toastr: ToastrService
  ) {}
}
