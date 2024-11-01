import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Client } from '../../models/client.model';
import { CLIENT } from '../../modules';

@Injectable({
  providedIn: 'root'
})
export class ClientsService extends EntityCollectionServiceBase<Client> {

  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super(CLIENT, serviceElementsFactory);
  }
}
