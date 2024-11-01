import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Client, ClientsService, Site, SitesService  } from 'core';
import { WKT } from 'ol/format';
import { Geometry } from 'ol/geom';
import { DrawEvent } from 'ol/interaction/Draw';
import { Vector } from 'ol/source';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-update-project-modal',
  templateUrl: './update-project-modal.component.html',
  styleUrls: ['./update-project-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateProjectModalComponent implements OnInit {
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

  updateProjectForm!: FormGroup;
  clients$!: Observable<Client[]>;

  constructor(
    private readonly fb: FormBuilder,
    private readonly clientsService: ClientsService,
    private readonly sitesService: SitesService,
    private readonly dialogRef: MatDialogRef<UpdateProjectModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    private readonly project: Site
  ) {
    this.updateProjectForm = this.fb.group({
      id: [this.project.id],
      title: [this.project.title, Validators.required],
      projectNumber: [this.project.projectNumber, Validators.required],
      date: [new Date(this.project.date), Validators.required],
      client: [this.project.client],
      file: [null],
      geom: [null],
    });
  }

  ngOnInit(): void {
    this.clients$ = this.clientsService.entities$;
    this.clientsService.getAll();
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

    this.updateProjectForm.patchValue({ geom, file: null });
    this.updateProjectForm.get('file').setErrors(null);
    this.drawing = false;
  }

  deleteFeature(source: Vector<Geometry>) {
    source.clear();
    this.updateProjectForm.get('file').setValue(null);
  }

  onUploadFile(event) {
    const file: File = event.files[0];
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop();

    if (['kml', 'geojson'].includes(fileExtension)) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (ev) => {
        this.updateProjectForm.patchValue({
          file,
          geom: null,
        });
      };
      this.updateProjectForm.get('file').setErrors(null);
    } else {
      this.updateProjectForm.get('file').setErrors({ invalidExtention: true });
    }
  }

  upload(file: File) {
    console.log('Uploading file', file);
  }

  submit() {
    if (this.updateProjectForm.invalid) {
      this.updateProjectForm.markAllAsTouched();
      this.updateProjectForm.updateValueAndValidity();
      return;
    }
    console.log(this.updateProjectForm.value);
    const formValue = { ...this.updateProjectForm.value };
      console.log(this.updateProjectForm.value);
      let resObservable:Observable<Site>;
      if (formValue.file) {
        const formData = new FormData();
        Object.entries(this.updateProjectForm.value).forEach(([key, value]) => {
          if(key === 'date') {
            value = (value as Date).toJSON()
          }
          formData.append(key, value as any);
        });
        resObservable = this.sitesService.add(formData as any);
      } else  {
        resObservable =  this.sitesService.add(formValue);
      }

      resObservable.subscribe(
        (res) => {
          this.dialogRef.close(res);
        }
      )

  }
}
