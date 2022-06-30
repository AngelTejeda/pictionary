import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RoomComponent } from './components/room/room.component';
import { HomeComponent } from './components/home/home.component';
import { DrawComponent } from './components/draw/draw.component';

import { AppRoutingModule } from './app-routing.module';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

import { CookieService } from 'ngx-cookie-service';
import { WebSocketService } from './services/websocket.service';

// const config: SocketIoConfig = { url: 'http://localhost:5000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    RoomComponent,
    HomeComponent,
    DrawComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule
  ],
  providers: [
    CookieService,
    WebSocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
