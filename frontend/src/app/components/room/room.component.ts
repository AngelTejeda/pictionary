import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DrawComponent } from '../draw/draw.component';

import { CookieService } from 'ngx-cookie-service';
import { RoomService } from 'src/app/services/room.service';

import { IRoomData } from 'src/app/models/socket-room-data';
import { IRoomUsers } from 'src/app/models/room-users';
import { IUser } from 'src/app/models/user';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  @ViewChild(DrawComponent) drawComponent!: DrawComponent;

  public room: string | null = null;
  private users: IRoomUsers = {};

  constructor(
    private activeRoute: ActivatedRoute,
    private cookieService: CookieService,
    private roomService: RoomService,
    private router: Router
  ) {
    this.room = this.activeRoute.snapshot.paramMap.get('room');

    if (this.room == null) {
      this.router.navigate(['']);
      return;
    }

    this.cookieService.set('room', this.room);
    this.roomService.changeRoom();
  }

  ngOnInit(): void {
    this.roomService.listenNewConnection().subscribe({
      next: (newUser: IUser) => {
        this.users[newUser.id] = newUser;
      }
    });

    this.roomService.listenUserDisconnected().subscribe({
      next: (user: IUser) => {
        delete this.users[user.id];
      }
    });
  }

  public loadRoomData(): void {
    this.roomService.getRoomData().subscribe({
      next: (roomData: IRoomData) => {
        this.users = roomData.users;

        this.drawComponent.socketId = roomData.id;
        this.drawComponent.loadPoints(roomData.points);
      }
    });
  }
}
