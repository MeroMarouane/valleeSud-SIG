import { Action, createReducer, on } from '@ngrx/store';

import * as AuthActions from './auth.actions';
import { AuthState, TokenStatus } from './auth.models';

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthPartialState {
  readonly [AUTH_FEATURE_KEY]: AuthState;
}

export const initialState: AuthState = {
  isLoggedIn: false,
  user: undefined,
  accessTokenStatus: TokenStatus.PENDING,
  isLoadingLogin: false,
  hasLoginError: false,
};

const reducer = createReducer(
  initialState,

  // Login
  on(
    AuthActions.loginRequest,
    (state): AuthState => ({
      ...state,
      accessTokenStatus: TokenStatus.VALIDATING,
      isLoadingLogin: true,
      hasLoginError: false,
    })
  ),

  // Login & Refresh token
  on(
    AuthActions.loginSuccess,
    (state): AuthState => ({
      ...state,
      isLoggedIn: true,
      isLoadingLogin: false,
      accessTokenStatus: TokenStatus.VALID,
    })
  ),
  on(
    AuthActions.loginFailure,
    (state, action): AuthState => ({
      ...state,
      isLoadingLogin: false,
      accessTokenStatus: TokenStatus.INVALID,
      hasLoginError: action.type === '[Auth] Login Failure' && !!action.error,
    })
  ),

  // Logout
  on(
    AuthActions.logout,
    (): AuthState => ({
      ...initialState,
    })
  ),

  // Auth user
  on(
    AuthActions.getAuthUserSuccess,
    (state, action): AuthState => ({
      ...state,
      user: action.user,
      accessTokenStatus: TokenStatus.VALID,
      isLoggedIn: true,
    })
  ),
  on(
    AuthActions.getAuthUserFailure,
    (): AuthState => ({
      ...initialState,
      accessTokenStatus: TokenStatus.INVALID,
    })
  )
);

export function authReducer(
  state: AuthState | undefined,
  action: Action
): AuthState {
  return reducer(state, action);
}
