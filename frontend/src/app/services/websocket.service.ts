import { EventEmitter, Injectable, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Socket, SocketIoConfig } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  @Output() outEvent: EventEmitter<any> = new EventEmitter();

  private config: SocketIoConfig = {
    url: 'http://localhost:5000',
    options: {}
  };

  constructor(
    private cookieService: CookieService,
    private _socket: Socket
  ) {
    // this.cookieService.get('room');
    this._socket = new Socket(this.config);
  }

  get socket(): Socket { return this._socket; }

  public getSocketId(): string | null {
    return this._socket.ioSocket.id
      ? this._socket.ioSocket.id
      : null;
  }

  public changeRoom(): void {
    this._socket.disconnect();
    this.config.options = {
      query: {
        roomName: this.cookieService.get('room')
      }
    };
    this._socket = new Socket(this.config);
  }


}
