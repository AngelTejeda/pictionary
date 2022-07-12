import { IPoint } from "./point";

export interface ISocketNewPoint {
  senderId: string,
  point: IPoint | null
}