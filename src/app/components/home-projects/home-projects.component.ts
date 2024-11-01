import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { Mission, Site } from 'core';

@Component({
  selector: 'app-home-projects',
  templateUrl: './home-projects.component.html',
  styleUrls: ['./home-projects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeProjectsComponent {

  selectedSite: Site | null = null;
  @Output()
  onSiteSelected = new EventEmitter<Site>();
  @Output()
  missionChanged = new EventEmitter<Mission>();

  getSiteMissions(site: Site): void {
    console.log('getSiteMissions', site);
    this.selectedSite = site;
    this.onSiteSelected.emit(this.selectedSite);
  }

  getSites() {
    this.selectedSite = null;
    this.onSiteSelected.emit(this.selectedSite);
  }

  onMissionChanged(mission: Mission) {
    this.missionChanged.emit(mission);
  }
}
