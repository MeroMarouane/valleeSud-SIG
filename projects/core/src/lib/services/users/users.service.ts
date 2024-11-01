import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { User } from '../../models';
import { USER } from '../../modules';

@Injectable({
  providedIn: 'root',
})
export class UsersService extends EntityCollectionServiceBase<User> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super(USER, serviceElementsFactory);
  }
}
