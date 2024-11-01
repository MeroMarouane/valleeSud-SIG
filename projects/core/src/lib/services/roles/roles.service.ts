import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { Role } from '../../models';
import { ROLE } from '../../modules';

@Injectable({
  providedIn: 'root',
})
export class RolesService extends EntityCollectionServiceBase<Role> {

  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super(ROLE, serviceElementsFactory);
  }
}
