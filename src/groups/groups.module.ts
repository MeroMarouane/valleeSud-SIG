import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupsComponent } from './groups.component';
import { RouterModule, Routes } from '@angular/router';
import { GroupsItemComponent } from './groups-item/groups-item.component';
import { GroupsSearchBarComponent } from './groups-search-bar/groups-search-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconsModule, PrimeNgModules } from 'shared-ui';
import { AddGroupModalComponent } from './add-group-modal/add-group-modal.component';
import { MaterialModule } from '../../projects/shared-ui/src/lib/modules/material/material.module';

/* A constant variable that is an array of objects. */
const routes: Routes = [
  {
    path: '',
    component: GroupsComponent
  }
]
@NgModule({
  declarations: [
    GroupsComponent,
    GroupsItemComponent,
    GroupsSearchBarComponent,
    AddGroupModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModules,
    IconsModule,
    MaterialModule
  ]
})
export class GroupsModule { }
