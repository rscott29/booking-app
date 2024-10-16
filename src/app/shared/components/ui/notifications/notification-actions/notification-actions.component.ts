import { Component, inject, Input, output } from '@angular/core';
import { NotificationMessage, NotificationStore } from '../state/notification.store';
import { MatButtonModule } from '@angular/material/button';
import { NotificationAction, NotificationActions } from './enums/notification-actions.enum';
import { NotificationTypes } from './enums/notification-types.enum';

@Component({
  selector: 'app-notification-actions',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './notification-actions.component.html',
  styleUrl: './notification-actions.component.scss'
})
export class NotificationActionsComponent {

  @Input() notification: NotificationMessage | undefined;
  notificationStore = inject(NotificationStore)
  notificationAction = NotificationActions;
  notificationType = NotificationTypes;
  onActionClick = output<NotificationAction>();

  constructor() {
  
  }
  emitActionClick(action: NotificationAction) {
    this.onActionClick.emit(action);
  }
  

}
