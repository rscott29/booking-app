import { isPlatformBrowser } from '@angular/common';
import { inject, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  getMessaging,
  getToken,
  Messaging,
  onMessage,
} from '@angular/fire/messaging';
import { Database, getDatabase, ref, set } from 'firebase/database';
import { BehaviorSubject } from 'rxjs';
import {
  NotificationMessage,
  NotificationStore,
} from '../components/ui/notifications/state/notification.store';
import { get, push } from '@angular/fire/database';
import { AppStore } from '../../app.store';

@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  public currentMessage = new BehaviorSubject<any>({});
  private messaging: Messaging | undefined;
  private db: Database | undefined;

  private notificationStore = inject(NotificationStore);
  private appStore = inject(AppStore);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.messaging = getMessaging();
      this.db = getDatabase();
    }
  }

  requestPermission(userId: string) {
    if (!this.messaging) return;
    getToken(this.messaging, {
      vapidKey:
        'BPFw23EfC3_Vhup9f7P_MVXmFZbLaHliW0lAePGJxygveo3vlLy66HiuwaYxgdl5q8Y2bTWyXJwOIEGYw7lm698',
    })
      .then((currentToken) => {
        if (currentToken) {
          console.log('Saving token...');
          this.saveToken(userId, currentToken);
        } else {
          console.error(
            'No registration token available. Request permission to generate one.'
          );
        }
      })
      .catch((err) => {
        console.error('An error occurred while retrieving token. ', err);
      });
  }

   saveToken(userId: string, token: string) {
    if (!token || !this.db) return;
    const tokenRef = ref(this.db, `users/${userId}/notificationToken`);
    set(tokenRef, token)
      .then(() => console.log('Token saved successfully.'))
      .catch((error) => console.error('Error saving token: ', error));
  }

  sendFriendRequest(friendId: string) {
    const userId = this.appStore.currentUser()?.uid;
    const userName = this.appStore.currentUser()?.displayName;

    console.log(`Sending request to ${friendId} from ${userId}`);

    if (userId && userName) {
      // Prevent duplicate requests
      const db = getDatabase();
      const userFriendsRef = ref(db, `/users/${userId}/sent_requests/${friendId}`);

      get(userFriendsRef)
        .then((snapshot) => {
          if (!snapshot.exists()) {
            set(userFriendsRef, {
              requesterId: userId,
              requesterUsername: userName,
              sendToId: friendId,
              status: 'pending',
            });
          } else {
            console.log('Friend request already exists.');
          }
        })
        .catch((error) => {
          console.error('Error checking friend request existence:', error);
        });
    }
  }



  receiveMessage() {
    if (!this.messaging) return;

    onMessage(this.messaging, (payload) => {

      if (!this.isValidPayload(payload)) {
        console.error('Invalid payload:', payload);
        return;
      }

      const newNotification = this.createNotificationMessage(payload.data);

        console.log('notification', newNotification)
      this.addNotificationToStore(newNotification);
    });
  }

  handleBackgroundMessage(newNotification: NotificationMessage) {
    // Pass the notification to a common handler

    this.addNotificationToStore(newNotification);
  }

  private addNotificationToStore(newNotification: NotificationMessage) {
    const existingNotifications = this.notificationStore.notifications();

    // Check if the notification already exists in the store
    const isDuplicate = existingNotifications.some(
      (notif) =>
        notif.body === newNotification.body &&
        notif.userId === newNotification.userId
    );

    // If not a duplicate, add the new notification
    if (!isDuplicate) {
      this.notificationStore.setNotifications(
        [...existingNotifications, newNotification]
      );
    } else {
      console.log('Duplicate notification, skipping...');
    }
  }

  private isValidPayload(payload: any): boolean {
    return (
      payload &&
      payload.data &&
      payload.data.body &&
      payload.data.title &&
      payload.data.userId
    );
  }

  private createNotificationMessage(data: any): NotificationMessage {
    return {
      messageId: data.messageId,
      read: data.read,
      body: data.body,
      userPhoto: data.userPhoto,
      notification_type: data.notification_type,
      title: data.title,
      userId: data.userId,
    };
  }
}
