import { BaseModel } from "./base.model";

export interface MissionFile extends BaseModel {
  mission_id: number;
  name: string;
  url: string;
}
