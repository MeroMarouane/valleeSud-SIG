import { ChangeDetectionStrategy, Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Mission, Site } from 'core';
import { MissionFileType, ProjectFileUploadModalComponent } from './project-file-upload-modal/project-file-upload-modal.component';

@Component({
  selector: 'app-project-file-upload',
  templateUrl: './project-file-upload.component.html',
  styleUrls: ['./project-file-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectFileUploadComponent implements OnInit {
  @Input() btnStyles: Record<string, unknown> = {};

  @Input() site: Site | null = null;
  @Input() mission: Mission | null = null;

  constructor(private readonly dialog: MatDialog) {}

  ngOnInit(): void {}
  openFileUpload(type: MissionFileType) {
    this.dialog.open(ProjectFileUploadModalComponent, {
      data: {
        type,
        site: this.site,
        mission: this.mission
      },
    });
  }
}
