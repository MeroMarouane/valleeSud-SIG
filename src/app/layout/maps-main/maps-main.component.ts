import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Mission, Site } from 'core';
import { Feature } from 'ol';
import { WKT } from 'ol/format';
import { BehaviorSubject } from 'rxjs';
import { PAGES } from '../../config/pages';

@Component({
  selector: 'app-maps-main',
  templateUrl: './maps-main.component.html',
  styleUrls: ['./maps-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapsMainComponent implements OnDestroy {
  showSitesMap = true;

  siteFeature$ = new BehaviorSubject<Feature>(null);

  currentRoute = '/' + PAGES.PLAN;
  selectedMission: Mission | null = null;

  siteSelected(site: Site) {
    this.showSitesMap = site === null;
    console.log('siteSelected', site);
    if (this.showSitesMap) {
      this.siteFeature$.next(null);
    } else {
      const feature: Feature = new WKT().readFeature(site.geom);
      this.siteFeature$.next(feature);
    }
  }

  ngOnDestroy(): void {
    this.siteFeature$.complete();
  }

  missionChanged(mission: Mission) {
    this.selectedMission = mission;
  }
}
