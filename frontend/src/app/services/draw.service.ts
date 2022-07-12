import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IPoint } from '../models/point';
import { INewPoint } from '../models/socket-new-point';
import { WebSocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class DrawService implements OnInit {

  constructor(
    private websocket: WebSocketService
  ) {

  }

  ngOnInit(): void {
  }

  // Listen
  public listenNewPoint(): Observable<INewPoint> {
    return this.websocket.socket.fromEvent('new-point');
  }

  public listenClearCanvas(): Observable<void> {
    return this.websocket.socket.fromEvent('clear-canvas');
  }

  // Emit
  public emitNewPoint(newPoint: IPoint | null): void {
    this.websocket.socket.emit('new-point', newPoint);
  }

  public emitClearCanvas(): void {
    this.websocket.socket.emit('clear-canvas', null);
  }

}