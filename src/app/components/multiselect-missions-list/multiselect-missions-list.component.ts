import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Mission, MissionsService, Site } from 'core';
import { Observable } from 'rxjs';
import { Required } from 'shared-ui';

@Component({
  selector: 'app-multiselect-missions-list',
  templateUrl: './multiselect-missions-list.component.html',
  styleUrls: ['./multiselect-missions-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiselectMissionsListComponent implements OnInit {
  @Input()
  @Required
  site!: Site;

  missions$!: Observable<Mission[]>;

  selectedMissions: Mission[] = [];

  @Output() change = new EventEmitter<Mission[]>();

  constructor(
    private readonly missionsService: MissionsService,
  ) {}

  ngOnInit(): void {
    this.missionsService.clearCache();
    this.missions$ = this.missionsService.entities$;
    this.missionsService.getWithQuery({ site_id: this.site.id });
  }

  missionChanged(event: Mission[]) {
    console.log(event);
    if(event.length > 2) {
      this.selectedMissions = event.slice(0, 2);
      this.change.emit(this.selectedMissions);
    }
    else {
      this.selectedMissions = event;
      this.change.emit(this.selectedMissions);
    }
  }

}
