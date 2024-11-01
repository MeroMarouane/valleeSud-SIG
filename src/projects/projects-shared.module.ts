import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectItemComponent } from './project-item/project-item.component';
import { RouterModule } from '@angular/router';
import { AddProjectModalComponent } from './add-project-modal/add-project-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'projects/shared-ui/src/lib/modules/material/material.module';
import { PrimeNgModules } from 'projects/shared-ui/src/lib/modules/primeng/primeng.module';
import { AddMissionModalComponent } from '../missions/add-mission-modal/add-mission-modal.component';
import { AddProjectUserModalComponent } from './add-project-user-modal/add-project-user-modal.component';
import { ProjectFileUploadComponent } from './project-file-upload/project-file-upload.component';
import { ProjectFileUploadModalComponent } from './project-file-upload/project-file-upload-modal/project-file-upload-modal.component';
import { AngularOpenlayersModule } from 'ngx-ol';
import { SharedUiModule } from 'shared-ui';
import { ProjectsMapComponent } from './projects-map/projects-map.component';
import { UpdateProjectModalComponent } from './update-project-modal/update-project-modal.component';

@NgModule({
  declarations: [
    ProjectItemComponent,
    AddProjectModalComponent,
    AddProjectUserModalComponent,
    UpdateProjectModalComponent,
    ProjectFileUploadComponent,
    ProjectFileUploadModalComponent,
    ProjectsMapComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PrimeNgModules,
    SharedUiModule,
    AngularOpenlayersModule
  ],
  exports: [
    ProjectItemComponent,
    AddProjectModalComponent,
    UpdateProjectModalComponent,
    ProjectFileUploadComponent,
    ProjectFileUploadModalComponent,
    ProjectsMapComponent,
  ],
})
export class ProjectsSharedModule {}
