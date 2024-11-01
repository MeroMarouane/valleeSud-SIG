import {
  Inject,
  Injectable,
  ModuleWithProviders,
  NgModule,
} from '@angular/core';
import {
  DefaultDataServiceConfig,
  DefaultHttpUrlGenerator,
  EntityDataModule,
  HttpResourceUrls,
  normalizeRoot,
  Pluralizer,
  HttpUrlGenerator
} from '@ngrx/data';
import { entityConfig } from './entity-metadata';

export const API_URL = 'API_URL';

@Injectable()
export class DataServiceConfig extends DefaultDataServiceConfig {
  constructor(@Inject(API_URL) apiUrl: string) {
    super();
    console.log('apiUrl: ' + apiUrl);
    this.root = apiUrl;
    this.timeout = 30000; // request timeout
  }
}

@Injectable()
export class PluralHttpUrlGenerator extends DefaultHttpUrlGenerator {
  constructor(private myPluralizer: Pluralizer) {
    super(myPluralizer);
  }

  protected override getResourceUrls(
    entityName: string,
    root: string
  ): HttpResourceUrls {
    let resourceUrls = this.knownHttpResourceUrls[entityName];
    if (!resourceUrls) {
      const nRoot = normalizeRoot(root);
      const url = `${nRoot}/${this.myPluralizer.pluralize(
        entityName
      )}/`.toLowerCase();
      console.log('url: ' + url);
      resourceUrls = {
        entityResourceUrl: url,
        collectionResourceUrl: url,
      };
      this.registerHttpResourceUrls({ [entityName]: resourceUrls });
    }
    return resourceUrls;
  }
}

@NgModule({
  imports: [EntityDataModule.forRoot(entityConfig)],
  providers: [
    { provide: DefaultDataServiceConfig, useClass: DataServiceConfig },
    { provide: HttpUrlGenerator, useClass: PluralHttpUrlGenerator },
  ],
})
export class EntityStoreModule {
  static forRoot(apiUrl: string): ModuleWithProviders<EntityStoreModule> {
    return {
      ngModule: EntityStoreModule,
      providers: [
        {
          provide: API_URL,
          useValue: apiUrl,
        },
      ],
    };
  }
}
