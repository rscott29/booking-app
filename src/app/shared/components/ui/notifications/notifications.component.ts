import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [MatListModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent {
  notifications = [
    {
      type: 'friend request recivecd',
      message: 'Bob McCheese has sent you a friend request',
    },
  ];
}
