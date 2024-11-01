import { OrthophotoTypes } from '../enums/orthophoto-types.enum';
import { MissionFile } from './mission-file.model';

export interface Orthophoto extends MissionFile {
  type: OrthophotoTypes;
  workspace: string;
}
