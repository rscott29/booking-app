// import { isPlatformBrowser } from '@angular/common';
// import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
// import { child, Database, get } from '@angular/fire/database';
// import { getMessaging, getToken, Messaging, onMessage } from '@angular/fire/messaging';
// import { getDatabase, ref, set } from 'firebase/database';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class MessagingService {
  
//   public currentMessage = new BehaviorSubject<any>({});

//   constructor(@Inject(PLATFORM_ID) private platformId: Object, private messaging: Messaging, private db: Database) {
//     if (isPlatformBrowser(this.platformId)) {
//     this.messaging = getMessaging();
//     }
//   }

//   requestPermission(userId: string) {
//     getToken(this.messaging, { vapidKey: 'BPFw23EfC3_Vhup9f7P_MVXmFZbLaHliW0lAePGJxygveo3vlLy66HiuwaYxgdl5q8Y2bTWyXJwOIEGYw7lm698'})
//       .then((currentToken) => {
//         if (currentToken) {
//           console.log('saving token....')
//           this.saveToken(userId, currentToken);
//         } else {
//           console.error(
//             'No registration token available. Request permission to generate one.'
//           );
//         }
//       })
//       .catch((err) => {
//         console.error('An error occurred while retrieving token. ', err);
//       });
//   }

//   private saveToken(userId: string, token: string) {
//     if (!token) return;
//     const db = getDatabase();
//     const tokenRef = ref(db, `users/${userId}/notificationToken`);
//     set(tokenRef, token)
//       .then(() => console.log('Token saved successfully.'))
//       .catch((error) => console.error('Error saving token: ', error));
//   }
 
//   sendFriendRequest(userId: string, friendId: string, requesterUsername: string) {
//     const db = getDatabase();
//     const userFriendsRef = ref(db, `/users/${friendId}/friends/${userId}`);
//     set(userFriendsRef, {
//       requesterId: userId,
//       requesterUsername: requesterUsername,
//       status: 'pending',
//     })
//       .then(() => {
//         console.log('Friend request sent');
//       })
//       .catch((error: any) => {
//         console.error('Error sending friend request:', error);
//       });
//   }
  

//   // receiveMessage() {
//   //   onMessage(this.messaging, (payload) => {
//   //     console.log('Message Received. ', payload);
//   //     this.currentMessage.next(payload);
//   //   });
//   // }
// }
import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { getMessaging, getToken, Messaging, onMessage } from '@angular/fire/messaging';
import { Database, getDatabase, ref, set } from 'firebase/database';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  public currentMessage = new BehaviorSubject<any>({});
  private messaging: Messaging | undefined;
  private db: Database | undefined;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.messaging = getMessaging();
      this.db = getDatabase();
    }
  }

  requestPermission(userId: string) {
    if (!this.messaging) return;
    getToken(this.messaging, { vapidKey: 'BPFw23EfC3_Vhup9f7P_MVXmFZbLaHliW0lAePGJxygveo3vlLy66HiuwaYxgdl5q8Y2bTWyXJwOIEGYw7lm698' })
      .then((currentToken) => {
        if (currentToken) {
          console.log('Saving token...');
          this.saveToken(userId, currentToken);
        } else {
          console.error('No registration token available. Request permission to generate one.');
        }
      })
      .catch((err) => {
        console.error('An error occurred while retrieving token. ', err);
      });
  }

  private saveToken(userId: string, token: string) {
    if (!token) return;
    if (this.db) {
      const tokenRef = ref(this.db, `users/${userId}/notificationToken`);
      set(tokenRef, token)
        .then(() => console.log('Token saved successfully.'))
        .catch((error) => console.error('Error saving token: ', error));
    }
   
  }

  sendFriendRequest(userId: string, friendId: string, requesterUsername: string) {
    if (this.db) {
    const userFriendsRef = ref(this.db, `/users/${friendId}/friends/${userId}`);
    set(userFriendsRef, {
      requesterId: userId,
      requesterUsername: requesterUsername,
      status: 'pending',
    })
      .then(() => {
        console.log('Friend request sent');
      })
      .catch((error: any) => {
        console.error('Error sending friend request:', error);
      });
    }
  }

  receiveMessage() {
    if (!this.messaging) return;
    onMessage(this.messaging, (payload) => {
      console.log('Message Received. ', payload);
      this.currentMessage.next(payload);
      this.handleMessage(payload);
    });
  }
   handleMessage(payload: any) {
    // Handle the message data and update the UI accordingly
    // For example, update a friend request list or notify a component
    console.log("Handling foreground message:", payload);
    // Example: update UI or service state
  }
}
