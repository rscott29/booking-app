import { Component, OnInit, inject } from '@angular/core';
import { MessagingService } from '../../../services/messaging.service';
import { MatListModule } from '@angular/material/list';
import { NotificationMessage, NotificationStore } from './state/notification.store';
import { MatButtonModule } from '@angular/material/button';
import { NotificationActionsComponent } from './notification-actions/notification-actions.component';
import { NotificationAction } from './notification-actions/enums/notification-actions.enum';
import { NotificationActionsService } from './notification-actions/notification-actions.service';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
  standalone: true,
  imports: [MatListModule, MatButtonModule, NotificationActionsComponent]
})
export class NotificationsComponent implements OnInit {

  readonly store = inject(NotificationStore); 
  private messageService = inject(MessagingService);
  private notificationActionService = inject(NotificationActionsService) 
  notifications: NotificationMessage[] | undefined;

  constructor() {
    
  }

  ngOnInit(): void {
    this.messageService.receiveMessage(); 
    console.log('Current notifications:', this.store.notifications());
 
  }
  handleActionClick(action: NotificationAction, id: string) {
      this.notificationActionService.handleAction(action, id)
    }
}
