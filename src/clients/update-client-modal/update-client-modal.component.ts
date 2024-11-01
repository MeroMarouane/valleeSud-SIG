import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClientsService, Client } from 'core';
import { AddClientModalComponent } from '../add-client-modal/add-client-modal.component';

@Component({
  selector: 'app-update-client-modal',
  templateUrl: './update-client-modal.component.html',
  styleUrls: ['./update-client-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateClientModalComponent implements OnInit {

  updateClientForm!: UntypedFormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public client: Client,
    private dialogRef: MatDialogRef<AddClientModalComponent>,
    private readonly fb: FormBuilder,
    private readonly clientsService: ClientsService
  ) {
    this.updateClientForm = this.fb.group({
      logo: [client.logo],
      name: [client.name, Validators.required],
      email: [client.email, [Validators.required, Validators.email]],
      phone: [client.phone, Validators.required],
      adresse: [client.adresse, Validators.required],
    });
  }

  ngOnInit(): void {
    console.log('AddClientModalComponent');
  }

  updateClient() {
    if (this.updateClientForm.invalid) {
      this.updateClientForm.markAllAsTouched();
      this.updateClientForm.updateValueAndValidity();
      return;
    }

    this.clientsService.update({id: this.client.id ,...this.updateClientForm.value} as Client);
    this.dialogRef.close();
  }

}
