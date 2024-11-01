import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEventType,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

interface FileProgress {
  name: string;
  progress: number;
  request: any;
}

@Injectable({
  providedIn: 'root',
})
export class MissionFileUploadService {
  private progress = new Map<string, FileProgress>();
  private progressSubject = new Subject<Omit<FileProgress, 'request'>[]>();

  get uploadProgresses$() {
    return this.progressSubject.asObservable();
  }

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  private upload(name: string, url: string, data: Record<string, any>) {
    if (!this.progress.has(name)) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      const request = new HttpRequest('POST', url, formData, {
        reportProgress: true,
      });

      this.toastr.info(`Téléchargement du fichier ${name}`);

      const fileProgress: FileProgress = {
        name: name,
        progress: 0,
        request: this.http.request(request).subscribe({
          next: (event) => {
            if (event.type === HttpEventType.UploadProgress) {
              const percentDone = event.total
                ? Math.round((100 * event.loaded) / event.total)
                : 0;
              if (
                this.progress.has(name) &&
                this.progress.get(name)?.progress !== percentDone
              ) {
                fileProgress.progress = percentDone;
                this.progress.set(name, fileProgress);
                this.emitProgress();
                console.log('progress', name, percentDone);
              }
            } else if (event instanceof HttpResponse) {
              fileProgress.progress = 100;
              this.progress.set(name, fileProgress);
              this.toastr.success(`${name} a été téléchargé avec succès`);
              this.emitProgress();
            }
          },
          error: (error) => {
            console.error(error);
            this.progress.delete(name);
            this.emitProgress();
            this.toastr.error(
              `${name} n'a pas pu être téléchargé, veuillez réessayer plus tard`
            );
          },
        }),
      };

      this.progress.set(name, fileProgress);
      this.emitProgress();
    }
  }

  uploadOrthophoto(
    missionName: string,
    mission: { mission_id: number; type: string; file: File }
  ) {
    console.log('file to upload', mission);

    this.upload(missionName, environment.apiUrl + '/orthophoto', mission);
  }

  uploadMesh(
    missionName: string,
    mission: { mission_id: number; type: string }
  ) {
    console.log('file to upload', mission);
    this.upload(missionName, environment.apiUrl + '/mesh3d', mission);
  }

  uploadPointCloud(
    missionName: string,
    mission: { mission_id: number; url: File }
  ) {
    this.upload(missionName, environment.apiUrl + '/pointcloud', mission);
  }

  public remove(name: string): void {
    const fileProgress = this.progress.get(name);
    if (fileProgress) {
      if (fileProgress.request) {
        fileProgress.request.unsubscribe();
      }
      this.progress.delete(name);
      this.emitProgress();
    }
  }

  private emitProgress(): void {
    this.progressSubject.next(
      Array.from(this.progress.values()).map(({ name, progress }) => ({
        name,
        progress,
      }))
    );
  }
}
