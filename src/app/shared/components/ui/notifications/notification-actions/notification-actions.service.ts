import { Injectable, inject } from "@angular/core";
import { OverlayService } from "../../../overlay.service";
import { NotificationStore } from "../state/notification.store";
import { NotificationAction, NotificationActions } from "./enums/notification-actions.enum";
import { AppStore } from "../../../../../app.store";

@Injectable({
  providedIn: 'root'
})
export class NotificationActionsService {


  private appStore = inject(AppStore);
  private overlayService = inject(OverlayService);
  private notifcationStore = inject(NotificationStore);

  constructor() { }


  private handleActionWithResponse<T>(action: NotificationAction, id: string, process: () => T): T {
    this.handleCommon(id);
    const result = process();
    console.log(`Action processed: ${action}`);
    return result;
  }


  handleAction(action: NotificationAction, id: string): void {
    if (!id) {
      console.warn(`Action ${action} requires a valid notification ID`);
      return;
    }

    switch(action) {
      case NotificationActions.APPROVE_FRIEND_REQUEST:
        this.handleActionWithResponse(action, id, () => this.handleApprove());
        break;
      case NotificationActions.REJECT_FRIEND_REQUEST:
        this.handleActionWithResponse(action, id, () => this.handleReject());
        break;
      default:
        console.warn(`No handler found for action ${action}`);
    }
  }


  private handleCommon(id: string): void {
    const userId = this.appStore.currentUser()?.uid;
 
    this.overlayService.close();
    if (userId) {
      this.notifcationStore.markNotificationAsRead(userId, id);
    } else {
      console.error('no valid notification id')
    }
 
  }

  private handleApprove(): void {
    console.log('Handling approve action...');
  }

  private handleReject(): void {
    console.log('Handling reject action...');
  }
}
