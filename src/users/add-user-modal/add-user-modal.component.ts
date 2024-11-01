import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  NonNullableFormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Role, RolesService, User, UsersService } from 'core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

const password_pattern =
  /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/;

@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddUserModalComponent {
  addUserForm: FormGroup;

  roles$: Observable<Role[]>;

  constructor(
    private readonly fb: NonNullableFormBuilder,
    private readonly route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA)
    private clientId: number,
    private readonly dialogRef: MatDialogRef<AddUserModalComponent>,
    private readonly usersService: UsersService,
    private readonly toastr: ToastrService,
    private readonly rolesService: RolesService
  ) {
    this.addUserForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      phone: ['', Validators.required],
      roles: [[], Validators.required],
    });

    this.roles$ = this.rolesService.getAll();
  }

  ConfirmedValidator(
    controlName: string,
    matchingControlName: string
  ): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const control = formGroup.get(controlName);
      const matchingControl = formGroup.get(matchingControlName);
      if (
        matchingControl?.errors &&
        !matchingControl.errors['confirmedValidator']
      ) {
        return null;
      }
      if (control?.value !== matchingControl?.value) {
        const error = { confirmedValidator: true };
        matchingControl?.setErrors(error);
        return error;
      } else {
        matchingControl?.setErrors(null);
        return null;
      }
    };
  }

  submit() {
    if (this.addUserForm.invalid) {
      this.addUserForm.markAllAsTouched();
      this.addUserForm.updateValueAndValidity();
      return;
    }

    const user = { ...this.addUserForm.value, client: this.clientId };

    delete user.confirmPassword;

    this.usersService.add(user as User).subscribe({
      next: (res) => {
        this.dialogRef.close();
        this.toastr.success('User added successfully!');
      },
      error: (err) => {
        this.toastr.error('Something went wrong!');
      },
    });
  }
}
