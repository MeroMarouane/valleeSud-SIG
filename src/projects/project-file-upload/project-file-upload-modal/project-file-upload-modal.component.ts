import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Mission, MissionsService, Site, SitesService } from 'core';
import { Observable, switchMap, tap } from 'rxjs';
import { MissionFileUploadService } from 'src/missions/services/mission-file-upload/mission-file-upload.service';

export type MissionFileType = 'points-cloud' | 'orthomosaic' | '3d-mech';

export interface SiteFileUploadData {
  type: MissionFileType;
  site: Site;
  mission: Mission;
}

@Component({
  selector: 'app-project-file-upload-modal',
  templateUrl: './project-file-upload-modal.component.html',
  styleUrls: ['./project-file-upload-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectFileUploadModalComponent implements OnInit {
  uploadSiteFileForm!: FormGroup;

  textMap: Record<string, string> = {
    'points-cloud': 'un nuage de points',
    orthomosaic: 'une orthomosaïque',
    '3d-mech': 'une maquette 3D-Mesh',
  };

  mechFiles = ['img', 'mtl', 'obj'];

  sites$: Observable<Site[]> | undefined;
  missions$: Observable<Mission[]> | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: SiteFileUploadData,
    fb: FormBuilder,
    private readonly sitesService: SitesService,
    private readonly missionsService: MissionsService,
    private readonly missionFilesUploadService: MissionFileUploadService,
    private readonly dialogRef: MatDialogRef<ProjectFileUploadModalComponent>
  ) {
    console.log('SiteFileUploadModalComponent this.data', data);
    const formObject = {
      site_id: [this.data.site?.id, Validators.required],
      mission: [this.data.mission, Validators.required],
      file: [null, Validators.required],
    };
    if (this.data.type === 'orthomosaic') {
      formObject['type'] = [null, Validators.required];
    }
    if (this.data.type === '3d-mech') {
      delete formObject.file;
      this.mechFiles.forEach((file) => {
        formObject['file_' + file] = [null, Validators.required];
      });
    }

    this.uploadSiteFileForm = fb.group(formObject);

    if (this.data.site === null) {
      this.sites$ = this.sitesService.entities$;

      this.sitesService.getAll();

      this.missions$ = this.uploadSiteFileForm
        .get('site_id')
        ?.valueChanges.pipe(
          tap((value) => console.log('site_id value changed', value)),
          switchMap((value) =>
            this.missionsService.getWithQuery({ site_id: value })
          )
        );
    }
  }

  ngOnInit(): void {}

  setFile(event: any, controlName: string) {
    console.log('setFile', event, controlName);
    this.uploadSiteFileForm.get(controlName)?.setValue(event.files?.at(0));
  }

  submit() {
    if (this.uploadSiteFileForm.invalid) {
      this.uploadSiteFileForm.markAllAsTouched();
      this.uploadSiteFileForm.updateValueAndValidity();
      return;
    }
    const { mission, ...value } = this.uploadSiteFileForm.value;
    const { title, id: mission_id } = mission as Mission;
    value['mission_id'] = mission_id;
    console.log('submit', this.uploadSiteFileForm.value);
    if (this.data.type === 'orthomosaic') {
      this.missionFilesUploadService.uploadOrthophoto(title, value);
    } else if (this.data.type === '3d-mech') {
      value['file_mlt'] = value['file_mtl'];
      delete value['file_mtl'];
      this.missionFilesUploadService.uploadMesh(title, value);
    } else if (this.data.type === 'points-cloud') {
      this.missionFilesUploadService.uploadPointCloud(title, {
        mission_id: value.mission_id,
        url: value.file,
      });
    }
    this.dialogRef.close();
  }
}
