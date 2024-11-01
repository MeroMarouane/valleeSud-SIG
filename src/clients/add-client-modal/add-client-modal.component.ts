import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Client, ClientsService } from 'core';

@Component({
  selector: 'app-add-client-modal',
  templateUrl: './add-client-modal.component.html',
  styleUrls: ['./add-client-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddClientModalComponent implements OnInit {
  addClientForm!: UntypedFormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly data: { group: string | null },
    private readonly dialogRef: MatDialogRef<AddClientModalComponent>,
    private readonly fb: FormBuilder,
    private readonly clientsService: ClientsService
  ) {
    this.addClientForm = this.fb.group({
      logo: [null],
      name: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      phone: [null, Validators.required],
      adresse: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    console.log('AddClientModalComponent');
  }

  addClient() {
    if (this.addClientForm.invalid) {
      this.addClientForm.markAllAsTouched();
      this.addClientForm.updateValueAndValidity();
      return;
    }

    const client = {
      ...this.addClientForm.value,
      // group: this.data.group,
    } as Client;

    this.clientsService.add(client);
    this.dialogRef.close();
  }
}
