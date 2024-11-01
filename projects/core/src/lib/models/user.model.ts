import { BaseModel } from "./base.model";
import { Client } from "./client.model";
import { Role } from "./role.model";
import { Site } from "./site.model";

export interface User extends BaseModel {
    firstname: string;
    lastname: string;
    name: string;
    email: string;
    phone: string;
    role: Role[];
    enabled: boolean;
    client: number | Client;
    projects?: number[] | Site[];
    photo?: string;
}
