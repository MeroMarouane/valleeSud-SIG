import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Client, ClientsService, SitesService, Status } from 'core';
import { WKT } from 'ol/format';
import { Geometry } from 'ol/geom';
import { DrawEvent } from 'ol/interaction/Draw';
import { Vector } from 'ol/source';
import { Observable, shareReplay } from 'rxjs';
import { AuthFacade } from 'src/auth/store/auth.facade';

@Component({
  selector: 'app-add-project-modal',
  templateUrl: './add-project-modal.component.html',
  styleUrls: ['./add-project-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProjectModalComponent implements OnInit {
  activateMap = false;

  drawing = false;

  mapLayers = {
    Plan: {
      name: 'Plan',
      layer: 'OSM',
      visibility: true,
    },
    Terrain: {
      name: 'Terrain',
      layer: 'terrain',
      visibility: false,
    },
    Satellite: {
      name: 'Satellite',
      layer: 'satellite',
      visibility: false,
    },
  };

  addProjectForm!: FormGroup;
  clients$!: Observable<Client[]>;

  constructor(
    private readonly fb: FormBuilder,
    private readonly clientsService: ClientsService,
    private readonly sitesService: SitesService,
    private readonly dialogRef: MatDialogRef<AddProjectModalComponent>,
    private readonly authFacade: AuthFacade
  ) {
    this.addProjectForm = this.fb.group({
      title: [null, Validators.required],
      number: [null, Validators.required],
      type: [null, Validators.required],
      date: [null, Validators.required],
      client: [null],
      file: [null],
      geom: [null],
      status: [Status.PENDING],
    });
  }

  ngOnInit(): void {
    this.clients$ = this.clientsService.entities$;
    this.clientsService.getAll();
    this.authFacade.user$
      .pipe(shareReplay(1))
      .subscribe((user) =>
        this.addProjectForm.patchValue({ client: (user.client as Client)?.id })
      );
  }

  activateDrawing(source: Vector<Geometry>) {
    if (this.drawing) {
      this.drawing = false;
    } else {
      const featuresCount = source.getFeatures().length;
      this.drawing = featuresCount === 0;
    }
  }

  polygonDrawEnd(event: DrawEvent) {
    const format = new WKT();
    const geom = format.writeFeatures([event.feature]);

    this.addProjectForm.patchValue({ geom, file: null });
    this.addProjectForm.get('file').setErrors(null);
    this.drawing = false;
  }

  deleteFeature(source: Vector<Geometry>) {
    source.clear();
    this.addProjectForm.patchValue({ geom: null });
  }

  onUploadFile(event) {
    const file: File = event.files[0];
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop();

    if (['kml', 'geojson'].includes(fileExtension)) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (ev) => {
        this.addProjectForm.patchValue({
          file,
          geom: null,
        });
      };
      this.addProjectForm.get('file').setErrors(null);
    } else {
      this.addProjectForm.get('file').setErrors({ invalidExtention: true });
    }
  }

  upload(file: File) {
    console.log('Uploading file', file);
  }

  submit() {
    if (this.addProjectForm.valid) {
      const formValue = { ...this.addProjectForm.value };
      console.log(this.addProjectForm.value);
      if (formValue.file) {
        const formData = new FormData();
        Object.entries(this.addProjectForm.value).forEach(([key, value]) => {
          if(key === 'date') {
            value = (value as Date).toJSON()
          }
          formData.append(key, value as any);
        });
        this.sitesService.add(formData as any);
      } else if (formValue.geom) {
        this.sitesService.add(formValue);
      }
      this.dialogRef.close();
    } else {
      this.addProjectForm.markAllAsTouched();
      this.addProjectForm.updateValueAndValidity();
    }
  }
}
