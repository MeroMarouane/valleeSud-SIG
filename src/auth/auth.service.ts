import { HttpClient } from '@angular/common/http';
import { APP_INITIALIZER, Injectable, Provider } from '@angular/core';
import { Store } from '@ngrx/store';
import { LoginDto, RegisterDto, User } from 'core';
import { lastValueFrom, Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import * as AuthActions from './store/auth.actions';
import { AuthState, TokenStatus } from './store/auth.models';
import * as AuthSelectors from './store/auth.selectors';
import { ACCESS_TOKEN } from './constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private hostUrl = environment.apiUrl;

  constructor(private store: Store, private http: HttpClient) {}

  /**
   * Returns a promise that waits until
   * refresh token and get auth user
   *
   * @returns {Promise<AuthState>}
   */
  init(): Promise<AuthState | null> {
    console.log('init');
    if (localStorage.getItem(ACCESS_TOKEN)) {
      this.store.dispatch(AuthActions.getAuthUserRequest());
    } else {
      return Promise.resolve(null);
    }

    const authState$ = this.store.select(AuthSelectors.selectAuth).pipe(
      filter(
        (auth) =>
          auth.accessTokenStatus === TokenStatus.INVALID ||
          (auth.accessTokenStatus === TokenStatus.VALID && !!auth.user)
      ),
      take(1)
    );

    return lastValueFrom(authState$);
  }

  /**
   * Performs a request with user credentials
   * in order to get auth tokens
   *
   * @param {string} email
   * @param {string} password
   * @returns Observable<AccessData>
   */
  login(email: string, password: string): Observable<LoginDto> {
    console.log(`test : ${this.hostUrl}/auth/login`);
    return this.http.post<LoginDto>(`${this.hostUrl}/auth/login/`, {
      email,
      password,
    });
  }

  /**
   * Performs a request for logout authenticated user
   */
  logout(): void {
    localStorage.removeItem(ACCESS_TOKEN);
  }

  /**
   * Returns authenticated user
   * based on saved access token
   *
   * @returns {Observable<AuthUser>}
   */
  getAuthUser(): Observable<User> {
    return this.http.get<User>(`${this.hostUrl}/auth/me/`);
  }

  register(registerDto: RegisterDto) {
    return this.http.post<User>(`${this.hostUrl}/auth/register`, registerDto);
  }
}

export const authServiceInitProvider: Provider = {
  provide: APP_INITIALIZER,
  useFactory: (authService: AuthService) => () => authService.init(),
  deps: [AuthService],
  multi: true,
};
