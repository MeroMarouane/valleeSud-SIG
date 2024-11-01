import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MissionsComponent } from './missions.component';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsSharedModule } from '../projects/projects-shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'projects/shared-ui/src/lib/modules/material/material.module';
import { PrimeNgModules, SharedDirectivesModule } from 'shared-ui';
import { AddMissionModalComponent } from './add-mission-modal/add-mission-modal.component';
import { MissionsMapComponent } from './missions-map/missions-map.component';
import { UpdateMissionModalComponent } from './update-mission-modal/update-mission-modal.component';

const routes: Routes = [
  {
    path: '',
    component: MissionsComponent
  }
]

@NgModule({
  declarations: [
    MissionsComponent,
    AddMissionModalComponent,
    UpdateMissionModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PrimeNgModules,
    ProjectsSharedModule,
    FormsModule,
    ReactiveFormsModule,
    SharedDirectivesModule,
    MaterialModule,
    MissionsMapComponent
  ]
})
export class MissionsModule { }
