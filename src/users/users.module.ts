import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { UsersComponent } from './users.component';
import { UsersItemComponent } from './users-item/users-item.component';
import { UsersSearchBarComponent } from './users-search-bar/users-search-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { PrimeNgModules, SharedDirectivesModule } from 'shared-ui';
import { AddUserModalComponent } from './add-user-modal/add-user-modal.component';
import { UpdateUserModalComponent } from './update-user-modal/update-user-modal.component';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent
  }
]

@NgModule({
  declarations: [
    UsersComponent,
    UsersItemComponent,
    UsersSearchBarComponent,
    AddUserModalComponent,
    UpdateUserModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModules,
    SharedDirectivesModule
  ]
})
export class UsersModule { }
