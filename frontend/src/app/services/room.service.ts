import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IRoomData } from '../models/socket-room-data';
import { IUser } from '../models/user';
import { WebSocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService implements OnInit {

  constructor(
    private websocket: WebSocketService
  ) {

  }

  ngOnInit(): void {
  }

  // Listen
  public getRoomData(): Observable<IRoomData> {
    return this.websocket.fromEvent('room-data');
  }

  public listenNewConnection(): Observable<IUser> {
    return this.websocket.fromEvent('new-connection');
  }

  public listenUserDisconnected(): Observable<IUser> {
    return this.websocket.fromEvent('user-disconnected');
  }

}