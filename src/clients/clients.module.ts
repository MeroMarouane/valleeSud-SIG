import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { PrimeNgModules, SharedDirectivesModule } from 'shared-ui';
import { AddClientModalComponent } from './add-client-modal/add-client-modal.component';
import { ClientsItemComponent } from './clients-item/clients-item.component';
import { ClientsSearchBarComponent } from './clients-search-bar/clients-search-bar.component';
import { ClientsComponent } from './clients.component';
import { MaterialModule } from '../../projects/shared-ui/src/lib/modules/material/material.module';
import { UpdateClientModalComponent } from './update-client-modal/update-client-modal.component';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';

const routes: Routes = [
  {
    path: '',
    component: ClientsComponent
  },
  {
    path: ':clientId/users',
    loadChildren: () => import('../users/users.module').then( m => m.UsersModule),
  }
]

@NgModule({
  declarations: [
    ClientsComponent,
    ClientsSearchBarComponent,
    ClientsItemComponent,
    AddClientModalComponent,
    UpdateClientModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    PrimeNgModules,
    MaterialModule,
    SharedDirectivesModule
  ]
})
export class ClientsModule { }
