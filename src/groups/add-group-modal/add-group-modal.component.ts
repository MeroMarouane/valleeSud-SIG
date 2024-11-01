import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Client, ClientsService, Group, GroupsService } from 'core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-group-modal',
  templateUrl: './add-group-modal.component.html',
  styleUrls: ['./add-group-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddGroupModalComponent implements OnInit {
  addGroupForm = this.fb.group({
    logo: [''],
    name: ['', Validators.required],
    clients: [new Array<number>()],
  });

  clients$!: Observable<Client[]>;

  constructor(
    private readonly fb: FormBuilder,
    private readonly groupsService: GroupsService,
    private readonly clientsService: ClientsService,
    private readonly dialogRef: MatDialogRef<AddGroupModalComponent>
  ) {
    this.clients$ = this.clientsService.entities$;
    this.clientsService.getAll();
  }

  ngOnInit(): void {
    console.log('AddClientModalComponent');
  }

  addGroup() {
    if (this.addGroupForm.invalid) {
      this.addGroupForm.markAllAsTouched();
      this.addGroupForm.updateValueAndValidity();
      return;
    }

    this.groupsService.add(this.addGroupForm.value as Group);
    this.dialogRef.close()
  }
}
