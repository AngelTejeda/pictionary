import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  room: string | null = null;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.room = this.activeRoute.snapshot.paramMap.get('room');

    if (this.room == null) {
      console.log('room is null');
      this.router.navigate(['']);
      return;
    }

    this.cookieService.set('room', this.room);
  }

  ngOnInit(): void {
    
  }

}
