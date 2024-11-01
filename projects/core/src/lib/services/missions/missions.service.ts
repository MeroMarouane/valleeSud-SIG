import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Mission } from '../../models/mission.model';
import { MISSION } from '../../modules';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MissionsService extends EntityCollectionServiceBase<Mission> {

  selectedMission$ = new BehaviorSubject<Mission | null>(null);

  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super(MISSION, serviceElementsFactory);
  }

  setSelectedMission(mission: Mission | null) {
    this.selectedMission$.next(mission);
  }
}
