import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MissionsService, Mission } from 'core';

@Component({
  selector: 'app-update-mission-modal',
  templateUrl: './update-mission-modal.component.html',
  styleUrls: ['./update-mission-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateMissionModalComponent implements OnInit {

  updateMissionForm!: FormGroup;
  constructor(
    private readonly fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private readonly mission: Mission,
    private readonly dialogRef: MatDialogRef<UpdateMissionModalComponent>,
    private readonly missionsService: MissionsService
  ) {
    this.updateMissionForm = this.fb.group({
      title: [this.mission.title, Validators.required],
      date: [new Date(this.mission.date), Validators.required],
      file: [null],
    });
    console.log('update mission', this.mission);
  }

  ngOnInit(): void {}

  submit() {
    if(this.updateMissionForm.invalid) {
      this.updateMissionForm.markAllAsTouched();
      this.updateMissionForm.updateValueAndValidity();
      return;
    }

    this.missionsService.update({
      ...this.mission,
      ...this.updateMissionForm.value
    }).subscribe(updatedMission => {
      this.dialogRef.close(updatedMission);
    })

  }

}
