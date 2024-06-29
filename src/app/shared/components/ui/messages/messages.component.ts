import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';


@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [MatIconModule, MatListModule, MatButtonModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent {
  @Input() data:any;
  messages = [
    {
      sender: 'bob smith', 
      message: 'you are cool. hopefully one day be cool too'
    },
    {
      sender: 'Richard Scott', 
      message: 'Hello! Great Job on your PB today!!'
    },
  ]
}
