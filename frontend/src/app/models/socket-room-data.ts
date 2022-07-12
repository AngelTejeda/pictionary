import { IPoint } from "./point";
import { IRoomPoints } from "./room-points";
import { IRoomUsers } from "./room-users";
import { IUser } from "./user";

export interface IRoomData {
  id: string,
  points: IRoomPoints,
  users: IRoomUsers
}