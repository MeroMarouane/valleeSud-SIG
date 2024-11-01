import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Role, RolesService, User, UsersService } from 'core';
import { AddUserModalComponent } from '../add-user-modal/add-user-modal.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-update-user-modal',
  templateUrl: './update-user-modal.component.html',
  styleUrls: ['./update-user-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateUserModalComponent implements OnInit {

  newPassword = new FormControl(null, [
    Validators.required,
    // Validators.pattern(
    //   password_pattern
    // ),
  ]);
  confirmPassword = new FormControl(null, [
    Validators.required,
    // Validators.pattern(
    //   password_pattern
    // ),
  ]);

  addUserForm: FormGroup;

  roles$: Observable<Role[]>;

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<AddUserModalComponent>,
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    @Inject(MAT_DIALOG_DATA) user: User
  ) {
    const userRoles = Array.isArray(user.role) ? user.role : [];
    this.addUserForm = this.fb.group({
      id: [user.id],
      name: [user.name, Validators.required],
      email: [user.email, [Validators.required, Validators.email]],
      password: this.newPassword,
      confirmPassword: this.confirmPassword,
      phone: [user.phone, Validators.required],
      role: [userRoles.map(r => r.id), Validators.required],
    });
    this.addUserForm.addValidators(
      this.ConfirmedValidator('password', 'confirmPassword')
    );

    this.roles$ = this.rolesService.getAll();
  }

  ngOnInit(): void {}

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

    const user = this.addUserForm.value;

    delete user.confirmPassword;

    this.usersService.update(user as User);

    this.dialogRef.close();
  }
}
