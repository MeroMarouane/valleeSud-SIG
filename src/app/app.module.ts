import { isDevMode, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EntityStoreModule } from 'core';
import { ToastrModule } from 'ngx-toastr';
import {
  MaterialModule,
  PrimeNgModules,
  SharedDirectivesModule,
} from 'shared-ui';
import { AuthModule } from 'src/auth/auth.module';
import { environment } from 'src/environments/environment';
import { ProjectsSharedModule } from 'src/projects/projects-shared.module';
import { AppComponent } from './app.component';
import { HomeMissionsListComponent } from './components/home-missions-list/home-missions-list.component';
import { HomeProjectsListComponent } from './components/home-projects-list/home-projects-list.component';
import { HomeProjectsComponent } from './components/home-projects/home-projects.component';
import { HeaderComponent } from './layout/header/header.component';
import { MainComponent } from './layout/main/main.component';
import { MapsMainComponent } from './layout/maps-main/maps-main.component';
import { AppRoutingModule } from './routes/app-routing.module';
import { authInterceptorProviders } from 'src/auth/interceptors';
import { AngularOpenlayersModule } from 'ngx-ol';
import { MissionsMapComponent } from 'src/missions/missions-map/missions-map.component';
import { MapsBalayerComponent } from './layout/maps-balayer/maps-balayer.component';
import { MapsSynchronizeComponent } from './layout/maps-synchronize/maps-synchronize.component';
import { MultiselectMissionsListComponent } from './components/multiselect-missions-list/multiselect-missions-list.component';
import { MissionFilesSwitchComponent } from 'src/missions/mission-files-switch/mission-files-switch.component';
import { MapsThreeDComponent } from './layout/maps-three-d/maps-three-d.component';
import { FooterComponent } from './layout/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    MapsMainComponent,
    HomeProjectsListComponent,
    HomeProjectsComponent,
    HomeMissionsListComponent,
    MapsBalayerComponent,
    MapsSynchronizeComponent,
    MultiselectMissionsListComponent,
    MapsThreeDComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    PrimeNgModules,
    MaterialModule,
    FormsModule,
    SharedDirectivesModule,
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([]),
    EntityStoreModule.forRoot(environment.apiUrl),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    AuthModule,
    ToastrModule.forRoot(),
    ProjectsSharedModule,
    AngularOpenlayersModule,
    MissionsMapComponent,
    MissionFilesSwitchComponent,
    FooterComponent,
    HeaderComponent,
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
