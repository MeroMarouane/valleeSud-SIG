import { BaseModel } from './base.model';
import { Group } from './group.model';
import { Site } from './site.model';

export interface Client extends BaseModel {
  name: string;
  logo?: string;
  group?: number | Group;
  phone?: string;
  email: string;
  adresse: string;
  projects: number[] | Site[];
}
