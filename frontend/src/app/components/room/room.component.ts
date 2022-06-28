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
  ) { }

  ngOnInit(): void {
    this.room = this.activeRoute.snapshot.paramMap.get('room');

    if (this.room == null) {
      this.router.navigate(['']);
    }

    this.cookieService.set('room', this.room as string);
  }

}
