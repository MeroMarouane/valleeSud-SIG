import { BaseModel } from "./base.model";
import { Client } from "./client.model";

export interface Group extends BaseModel {
    logo: string;
    name: string;
    clients?: number[] | Client[];
}