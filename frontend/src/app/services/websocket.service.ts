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
          nameRoom: cookieService.get('room')
        }
      }
    });

    this.listenEvent();
  }

  private listenEvent(): void{
    this.ioSocket.on('event', (res: any) => { this.outEvent.emit(res) });
  }

  public emitEvent(payload = {}): void {
    this.ioSocket.emit('event', payload);
  }
}
