import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Mission, MissionsService, Site } from 'core';
import { Observable } from 'rxjs';
import { Required } from 'shared-ui';
import { AddMissionModalComponent } from 'src/missions/add-mission-modal/add-mission-modal.component';
import { Map } from 'ol';

@Component({
  selector: 'app-home-missions-list',
  templateUrl: './home-missions-list.component.html',
  styleUrls: ['./home-missions-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeMissionsListComponent implements OnInit, OnDestroy {
  @Input()
  @Required
  site!: Site;

  @Input()
  showAddButton = true;

  @Input()
  showClientInfos = false;

  @Output()
  onBackToSites = new EventEmitter();

  @Output()
  change = new EventEmitter();

  missions$!: Observable<Mission[]>;

  selectedMission: Mission | null = null;
  currentMap: Map | null = null;

  missionMapButtons = ['3d-btn', 'dsm-btn', 'measure-btn']

  constructor(
    private readonly missionsService: MissionsService,
    private readonly dialog: MatDialog,
){}

  ngOnInit(): void {
    this.missionsService.clearCache();
    this.missions$ = this.missionsService.entities$;
    this.missionsService.getWithQuery({ site_id: this.site.id });
    this.toggleMissionMapControls();
  }

  ngOnDestroy(): void {
    this.missionsService.setSelectedMission(null);
  }

  toggleMissionMapControls() {
    const setButtonsDisplay = (value: 'block' | 'none') => {
      this.currentMap
        ?.getControls()
        .getArray()
        .forEach((control) => {
          const element: HTMLElement = (control as any).element;
          if (this.missionMapButtons.includes(element.id)) {
            element.style.display = value;
          }
        });
    };
    if (!!this.selectedMission) {
      setButtonsDisplay('block');
    } else {
      setButtonsDisplay('none');
    }
  }

  missionChanged(event: Mission) {
    console.log(event);
    this.missionsService.setSelectedMission(event);
    this.change.emit(event);
    this.toggleMissionMapControls();
  }

  addMission() {
    this.dialog.open(AddMissionModalComponent, {
      data: this.site,
    });
  }

  missionClick(mission: Mission) {
    console.log('mission clicked', mission);
  }

  backToProjects() {
    this.selectedMission = null;
    this.toggleMissionMapControls();
    this.onBackToSites.emit();
  }
}
