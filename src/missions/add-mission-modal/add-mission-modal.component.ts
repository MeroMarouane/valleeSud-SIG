import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MissionsService, Site } from 'core';

@Component({
  selector: 'app-add-mission-modal',
  templateUrl: './add-mission-modal.component.html',
  styleUrls: ['./add-mission-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AddMissionModalComponent implements OnInit {
  addMissionForm!: FormGroup;
  constructor(
    private readonly fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private readonly site: Site,
    private readonly dialogRef: MatDialogRef<AddMissionModalComponent>,
    private readonly missionsService: MissionsService
  ) {
    this.addMissionForm = this.fb.group({
      title: [null, Validators.required],
      date: [null, Validators.required],
      file: [null],
    });
    console.log('new mission site', this.site);
  }

  ngOnInit(): void {}

  submit() {
    if(this.addMissionForm.invalid) {
      this.addMissionForm.markAllAsTouched();
      this.addMissionForm.updateValueAndValidity();
      return;
    }

    this.missionsService.add({
      ...this.addMissionForm.value,
      site_id: this.site.id
    })

    this.dialogRef.close();
  }
}
