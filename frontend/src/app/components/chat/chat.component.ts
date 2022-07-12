import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  public message: string = '';
  public messages: { username: string, text: string }[] = [];

  public username = 'Anonymous';

  constructor() { }

  ngOnInit(): void {
  }

  public handleEnter(event: Event) {
    event.preventDefault();
    const keyboardEvent: KeyboardEvent = event as KeyboardEvent;

    if (!keyboardEvent.shiftKey) {
      this.messages.push({
        username: this.username,
        text: this.message
      });
      this.message = '';
    }
  }

}
