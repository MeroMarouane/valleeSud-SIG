import { Status } from '../enums';
import { BaseModel } from './base.model';
import { Mesh3D } from './mesh3d.model';
import { Orthophoto } from './orthophoto.model';
import { PointCloud } from './point-cloud.model';
import { Site } from './site.model';

export interface Mission extends BaseModel {
  title: string;
  status: Status;
  date: Date;
  site: Site;
  url: string;
  orthophotos: Orthophoto[],
  pointClouds: PointCloud,
  mesh3ds: Mesh3D,
}
