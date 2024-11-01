import { Status } from '../enums';
import { BaseModel } from './base.model';
import { Client } from './client.model';
import { Mission } from './mission.model';
import { User } from './user.model';

export interface Site extends BaseModel {
  title: string;
  projectNumber: number;
  status: Status;
  date: Date;
  missions: number | Mission[];
  client: number | Client;
  users: number[] | User[];
  geom: string;
  url: string;
}
