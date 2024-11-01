import { BaseModel } from "./base.model";

export interface Permission extends BaseModel {
  name: string;
  guard_name?: string;
  checked?: boolean;
}
