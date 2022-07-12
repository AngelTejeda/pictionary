import { IUser } from "./user";

export interface IRoomUsers {
  [socketId: string]: IUser;
}