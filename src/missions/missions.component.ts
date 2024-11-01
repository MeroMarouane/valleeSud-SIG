import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MissionsService, Site, SitesService, Mission } from 'core';
import { ToastrService } from 'ngx-toastr';
import { Feature } from 'ol';
import {  WKT } from 'ol/format';
import {
  Observable,
  switchMap,
  tap,
  Subscription,
  of,
  map,
  BehaviorSubject,
} from 'rxjs';
import { ConfirmDialogComponent } from 'shared-ui';
import { UpdateProjectModalComponent } from 'src/projects/update-project-modal/update-project-modal.component';
import { AddProjectUserModalComponent } from '../projects/add-project-user-modal/add-project-user-modal.component';
import { AddMissionModalComponent } from './add-mission-modal/add-mission-modal.component';
import { UpdateMissionModalComponent } from './update-mission-modal/update-mission-modal.component';
import { PAGES } from 'src/app/config/pages';


@Component({
  selector: 'app-missions',
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MissionsComponent implements OnInit, OnDestroy {
  mission$ = new BehaviorSubject<Mission | null>(null);

  site$: Observable<Site> = of(null);
  site!: Site;
  siteFeature$ = new BehaviorSubject<Feature>(null);
  missions$!: Observable<Mission[]>;

  currentRoute = `/${PAGES.PLAN}`;

  subscriptions: Subscription[] = [];

  constructor(
    private readonly toastr: ToastrService,
    private readonly dialog: MatDialog,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly sitesService: SitesService,
    private readonly missionsService: MissionsService
  ) {}

  ngOnInit(): void {
    this.missionsService.clearCache();
    this.subscriptions.push(
      this.route.params
        .pipe(
          switchMap((params) => this.sitesService.getByKey(params['id'])),
          tap((site) => {
            console.log('site', site);
            this.site = site;
            this.site$ = this.sitesService.entityMap$.pipe(
              map((sitesMap) => sitesMap[site.id])
            );
            this.subscriptions.push(
              this.site$.subscribe((site) => {
                if (site) {
                  const siteFeatures = new WKT().readFeatures(
                    site.geom
                  );
                  this.siteFeature$.next(siteFeatures.at(0));
                }
              })
            );

            this.missionsService.getWithQuery({ site_id: site.id });
          })
        )
        .subscribe()
    );
    this.missions$ = this.missionsService.entities$;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.missionsService.setSelectedMission(null);
  }

  addMission() {
    this.dialog.open(AddMissionModalComponent, {
      data: this.site,
    });
  }

  updateMission() {
    this.subscriptions.push(
      this.dialog
        .open(UpdateMissionModalComponent, {
          data: this.mission$.getValue(),
        })
        .afterClosed()
        .subscribe((mission) => {
          if (mission) {
            this.mission$.next(mission);
            this.toastr.success('mission updated successfully!');
          }
        })
    );
  }

  missionChanged(event: any) {
    console.log(event);
    this.mission$.next(event);
  }

  unSelectMissions() {
    console.log('site item clicked');
    this.mission$.next(null);
  }

  deleteMission() {
    this.subscriptions.push(
      this.dialog
        .open(ConfirmDialogComponent, {
          data: {
            title: 'Confirmation',
            message: 'Êtes-vous sùr de vouloir supprimer cette mission?',
          },
        })
        .afterClosed()
        .subscribe((result) => {
          if (result) {
            this.subscriptions.push(
              this.missionsService
                .delete(this.mission$.getValue().id)
                .subscribe(() => {
                  this.missionsService.delete(this.mission$.getValue());
                  this.unSelectMissions();
                  this.toastr.success('mission supprimée avec succès');
                })
            );
          }
        })
    );
  }

  addUsers() {
    this.dialog.open(AddProjectUserModalComponent, { height: '350px' });
  }

  updateSite() {
    this.subscriptions.push(
      this.dialog
        .open(UpdateProjectModalComponent, {
          data: this.site,
        })
        .afterClosed()
        .subscribe((site) => {
          if (site) {
            this.site = site;
            this.site$ = of(site);
            this.toastr.success('Le site a été mis à jour avec succés!');
          }
        })
    );
  }

  deleteSite() {
    this.subscriptions.push(
      this.dialog
        .open(ConfirmDialogComponent, {
          data: {
            title: 'Confirmation',
            message: 'Êtes-vous sùr de vouloir supprimer ce Site?',
          },
        })
        .afterClosed()
        .subscribe((result) => {
          if (result) {
            this.subscriptions.push(
              this.sitesService.delete(this.site.id).subscribe(() => {
                this.toastr.success('Site supprimée avec succès');
                this.router.navigate(['/sites']);
              })
            );
          }
        })
    );
  }
}
