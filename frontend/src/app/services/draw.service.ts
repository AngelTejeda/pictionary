import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IPoint } from '../models/point';
import { ISocketNewPoint } from '../models/socket-new-point';
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
  public listenNewPoint(): Observable<ISocketNewPoint> {
    return this.websocket.fromEvent('new-point');
  }

  public listenClearCanvas(): Observable<void> {
    return this.websocket.fromEvent('clear-canvas');
  }

  // Emit
  public emitNewPoint(newPoint: IPoint | null): void {
    this.websocket.emit('new-point', newPoint);
  }

  public emitClearCanvas(): void {
    this.websocket.emit('clear-canvas', null);
  }

}