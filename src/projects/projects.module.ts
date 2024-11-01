import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsComponent } from './projects.component';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsSharedModule } from './projects-shared.module';
import { PrimeNgModules } from 'shared-ui';

const routes: Routes = [
  {
    path: '',
    component: ProjectsComponent
  },
  {
    path: ':id/missions',
    data: {
      hideFooter: true
    },
    loadChildren: () => import('../missions/missions.module').then(m => m.MissionsModule),
  }
]

@NgModule({
  declarations: [
    ProjectsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PrimeNgModules,
    ProjectsSharedModule
  ]
})
export class ProjectsModule { }
