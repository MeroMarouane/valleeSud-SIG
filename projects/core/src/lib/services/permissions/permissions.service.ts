import { Injectable } from '@angular/core';
import { Permission } from '../../models';
import { PERMISSION } from '../../modules';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService extends EntityCollectionServiceBase<Permission> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super(PERMISSION, serviceElementsFactory);
  }
}
