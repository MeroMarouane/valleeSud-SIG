import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard, NoAdminGuard, NoAuthGuard, RolesGuard } from 'src/auth/guards';
import { MENU_ITEMS } from '../config/menu-items';
import { PAGES } from '../config/pages';
import { MainComponent } from '../layout/main/main.component';
import { MapsBalayerComponent } from '../layout/maps-balayer/maps-balayer.component';
import { MapsMainComponent } from '../layout/maps-main/maps-main.component';
import { MapsSynchronizeComponent } from '../layout/maps-synchronize/maps-synchronize.component';
import { MapsThreeDComponent } from '../layout/maps-three-d/maps-three-d.component';
import { ROLES } from 'core';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: MENU_ITEMS[PAGES.DASHBOARD].routerLink,
  },
  {
    path: MENU_ITEMS[PAGES.DASHBOARD].routerLink,
    pathMatch: 'full',
    canActivate: [AuthGuard, NoAdminGuard],
    loadComponent: () =>
      import('../../dashboard/dashboard.component').then(
        (x) => x.DashboardComponent
      ),
  },
  {
    path: MENU_ITEMS[PAGES.PLAN].routerLink,
    canActivate: [AuthGuard],
    pathMatch: 'full',
    component: MapsMainComponent,
  },
  {
    path: 'threed/:missionId',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    component: MapsThreeDComponent,
  },
  {
    path: 'balayage/:siteId',
    canActivate: [AuthGuard],
    pathMatch: 'full',
    component: MapsBalayerComponent,
  },
  {
    path: 'synchronize/:siteId',
    canActivate: [AuthGuard],
    pathMatch: 'full',
    component: MapsSynchronizeComponent,
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: MainComponent,
    children: [
      {
        path: MENU_ITEMS[PAGES.SITES].routerLink,
        data: {
          hideFooter: true
        },
        loadChildren: () =>
          import('src/projects/projects.module').then((m) => m.ProjectsModule),
      },
      {
        path: MENU_ITEMS[PAGES.USERS].routerLink,
        loadChildren: () =>
          import('src/users/users.module').then((m) => m.UsersModule),
      },
      {
        path: MENU_ITEMS[PAGES.CLIENTS].routerLink,
        canActivate: [RolesGuard],
        data: {
          roles: [ROLES.ADMIN]
        },
        loadChildren: () =>
          import('src/clients/clients.module').then((m) => m.ClientsModule),
      },
      {
        path: MENU_ITEMS[PAGES.GROUPES].routerLink,
        canActivate: [RolesGuard],
        data: {
          roles: [ROLES.ADMIN]
        },
        loadChildren: () =>
          import('src/groups/groups.module').then((m) => m.GroupsModule),
      },
      {
        path: MENU_ITEMS[PAGES.PARAMETERS].routerLink,
        loadChildren: () =>
          import('src/parameters/parameters.module').then(
            (m) => m.ParametersModule
          ),
      },
    ],
  },
  {
    path: PAGES.ACCOUNT,
    canActivate: [NoAuthGuard],
    loadChildren: () =>
      import('src/account/account.module').then((m) => m.AccountModule),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled'
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
