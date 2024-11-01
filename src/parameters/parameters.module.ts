import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParametersComponent } from './parameters.component';
import { AdminUsersSearchBarComponent } from './users/admin-users-search-bar/admin-users-search-bar.component';
import { AdminUsersItemComponent } from './users/admin-users-item/admin-users-item.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { AccountPlanComponent } from './account-plan/account-plan.component';
import { FooterComponent } from 'src/app/layout/footer/footer.component';
import { RolesManagementComponent } from './roles-management/roles-management.component';
import { PrimeNgModules } from 'shared-ui';
import { NoAdminGuard, RolesGuard } from 'src/auth/guards';

const routes: Routes = [
  {
    path: '',
    component: ParametersComponent,
    children: [
      {
        path: '',
        redirectTo: 'details-compte',
        pathMatch: 'full',
      },
      {
        path: 'details-compte',
        component: AccountDetailsComponent,
      },
      {
        path: 'abonnement',
        component: AccountPlanComponent,
        canActivate: [NoAdminGuard]
      },
      {
        path: 'roles',
        canActivate: [RolesGuard],
        component: RolesManagementComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    ParametersComponent,
    AdminUsersSearchBarComponent,
    AdminUsersItemComponent,
    AccountDetailsComponent,
    AccountPlanComponent,
    RolesManagementComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModules,
    FooterComponent,
  ],
})
export class ParametersModule {}
