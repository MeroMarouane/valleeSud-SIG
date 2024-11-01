import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Group } from '../../models/group.model';
import { GROUP } from '../../modules';

@Injectable({
  providedIn: 'root'
})
export class GroupsService extends EntityCollectionServiceBase<Group> {

  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super(GROUP, serviceElementsFactory);
  }
}

