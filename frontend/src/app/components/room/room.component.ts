import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { IUser } from 'src/app/models/user';
import { IPoint } from 'src/app/models/point';
import { WebSocketService } from 'src/app/services/websocket.service';
import { IRoomData } from 'src/app/models/socket-room-data';
import { IRoomPoints } from 'src/app/models/room-points';
import { IRoomUsers } from 'src/app/models/room-users';
import { DrawComponent } from '../draw/draw.component';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements AfterViewInit {

  @ViewChild(DrawComponent) drawComponent!: DrawComponent;

  public room: string | null = null;
  private users: IRoomUsers = {};

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService,
    private roomService: RoomService
  ) {
    // TODO: The websocket service is loaded before the cookie service,
    // so the cookie service is not yet available.
    this.room = this.activeRoute.snapshot.paramMap.get('room');

    if (this.room == null) {
      this.router.navigate(['']);
      return;
    }

    this.cookieService.set('room', this.room);
  }

  ngAfterViewInit(): void {

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
