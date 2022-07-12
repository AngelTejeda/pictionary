import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRoomData } from '../models/socket-room-data';
import { IUser } from '../models/user';
import { WebSocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(
    private websocket: WebSocketService
  ) {

  }

  public changeRoom(): void {
    this.websocket.changeRoom();
  }

  // Listen
  public getRoomData(): Observable<IRoomData> {
    return this.websocket.socket.fromEvent('room-data');
  }

  public listenNewConnection(): Observable<IUser> {
    return this.websocket.socket.fromEvent('new-connection');
  }

  public listenUserDisconnected(): Observable<IUser> {
    return this.websocket.socket.fromEvent('user-disconnected');
  }

}