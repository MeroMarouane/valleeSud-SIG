import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'core';
import { AuthFacade } from 'src/auth/store/auth.facade';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
    rememberMe: [false],
  });

  constructor(
    private fb: FormBuilder,
    private authFacade: AuthFacade
  ) {}

  ngOnInit(): void {}
  isLoading$ = this.authFacade.isLoadingLogin$;
  showLoginError$ = this.authFacade.hasLoginError$;

  login(): void {
    if(this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.loginForm.updateValueAndValidity();
      return
    }
    const { email, password } = this.loginForm.value as any;
    this.authFacade.login(email, password);
  }
}
