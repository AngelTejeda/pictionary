import { EventEmitter, Injectable, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService extends Socket {

  @Output() outEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    private cookieService: CookieService
  ) {
    super({
      url: 'http://localhost:5000',
      options: {
        query: {
          roomName: cookieService.get('room')
        }
      }
    });
  }

  public getSocketId(): string | null {
    return this.ioSocket.id
      ? this.ioSocket.id
      : null;
  }


}
