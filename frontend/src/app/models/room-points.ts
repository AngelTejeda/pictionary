import { IPoint } from "./point";

export interface IRoomPoints {
  [userId: string]: (IPoint | null)[];
}