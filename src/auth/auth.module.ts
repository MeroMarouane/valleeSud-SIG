import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ToastrModule } from 'ngx-toastr';

import { AuthService, authServiceInitProvider } from './auth.service';
import { AuthEffects } from './store/auth.effects';
import { AuthFacade } from './store/auth.facade';
import { authReducer, AUTH_FEATURE_KEY } from './store/auth.reducer';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StoreModule.forFeature(AUTH_FEATURE_KEY, authReducer),
    EffectsModule.forFeature([AuthEffects]),
    ToastrModule.forRoot(),
  ],
  providers: [AuthFacade, AuthService, authServiceInitProvider],
})
export class AuthModule {}
