import { User } from "core";

export enum TokenStatus {
  PENDING = 'PENDING',
  VALIDATING = 'VALIDATING',
  VALID = 'VALID',
  INVALID = 'INVALID',
}

export interface AuthState {
  isLoggedIn: boolean;
  user?: User;
  accessTokenStatus: TokenStatus;
  isLoadingLogin: boolean;
  hasLoginError: boolean;
}