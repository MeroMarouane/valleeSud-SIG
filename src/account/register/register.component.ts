import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { RegisterDto } from 'core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit {
  registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, RxwebValidators.email()]],
    password: ['', Validators.required],
    confirm_password: [
      '',
      RxwebValidators.compare({
        fieldName: 'password',
        message: "Ce n'est pas le même Mot de passe ",
      }),
    ],
  });

  constructor(
    private fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.registerForm.updateValueAndValidity();
      return;
    }

    const { name, email, password } = this.registerForm.value;

    const registerDto: RegisterDto = {
      name,
      email,
      password,
      client: 1,
      roles: [],
    };

    this.authService.register(registerDto).subscribe((result) => {
      if (result.id) {
        this.toastr.success('Vous êtes inscrit avec succès ! ');
        this.toastr.success(
          'Vous pouvez dès à présent vous connecter avec votre email et mot de passe.'
        );
        this.router.navigate(['/login']);
      } else {
        this.toastr.error("Une erreur est survenue lors de l'inscription.");
      }
    });
  }
}
