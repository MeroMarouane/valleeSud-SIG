import { EntityDataModuleConfig } from '@ngrx/data';
import { USER, CLIENT, GROUP, PARAMETER, MISSION, SITE, ROLE, PERMISSION } from './entities';

export const entityConfig: EntityDataModuleConfig = {
  entityMetadata: {
    [USER]: {},
    [CLIENT]: {},
    [GROUP]: {},
    [PARAMETER]: {},
    [SITE]: {},
    [MISSION]: {},
    [ROLE]: {},
    [PERMISSION]: {},
  },
};
