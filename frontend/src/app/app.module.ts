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
import { ChatComponent } from './components/chat/chat.component';
import { FormsModule } from '@angular/forms';

const config: SocketIoConfig = { url: '', options: { autoConnect: false } };

@NgModule({
  declarations: [
    AppComponent,
    RoomComponent,
    HomeComponent,
    DrawComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [
    CookieService,
    WebSocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
