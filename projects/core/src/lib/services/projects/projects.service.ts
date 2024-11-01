import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { BehaviorSubject, of, switchMap, take } from 'rxjs';
import { Site } from '../../models';
import { SITE } from '../../modules';

@Injectable({
  providedIn: 'root',
})
export class SitesService extends EntityCollectionServiceBase<Site> {

  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super(SITE, serviceElementsFactory);
  }

  selectedProject$ = new BehaviorSubject<Site | null>(null);

  setSelectedProject(id: number) {
    if(!id) this.selectedProject$.next(null);
    this.entityMap$.pipe(
      take(1),
      switchMap((entityMap) => {
        const project = entityMap[id];
        if (project) {
          return of(project);
        }
        return this.getByKey(id);
      })
    ).subscribe((site) => {
      console.log('next site', site)
      this.selectedProject$.next(site);
    });
  }
}
