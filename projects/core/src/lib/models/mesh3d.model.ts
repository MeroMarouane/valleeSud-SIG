import { MissionFile } from "./mission-file.model";

export interface Mesh3D extends MissionFile {
  file_mlt: string;
  file_obj: string;
}
