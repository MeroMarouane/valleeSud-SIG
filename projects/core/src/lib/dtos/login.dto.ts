import { User } from "../models";

export interface LoginDto {
  user: User,
  authorisation: {
    token: string,
    type: string
  }
}
