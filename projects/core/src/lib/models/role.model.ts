import { BaseModel } from "./base.model";
import { Permission } from "./permission.model";

export interface Role extends BaseModel {
  name: string;
  guard_name: string;
  pemissions: Permission[];
}
