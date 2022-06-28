import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketwebService extends Socket {

  private baseUrl: string = "";

  constructor() {
    super({
      url: ''
    });
  }
}
