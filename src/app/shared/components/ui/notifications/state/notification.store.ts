import { computed, effect, inject } from '@angular/core';
import {
  getState,
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  Database,
  equalTo,
  onValue,
  orderByChild,
  query,
  ref,
  update,
} from '@angular/fire/database';
import { AppStore } from '../../../../../app.store';

export interface NotificationMessage {
  messageId: string;
  body: string;
  userPhoto: string,
  notification_type: string;
  title: string;
  userId: string;
  read: string;
}

type NotificationState = {
  notifications: NotificationMessage[];
  isLoading: boolean;
  unreadCount: number;
};

const initialState: NotificationState = {
  notifications: [],
  isLoading: false,
  unreadCount: 0,
};

export const NotificationStore = signalStore(
  withState(initialState),
  withMethods((store) => {
    const db = inject(Database);

    return {
      async setNotifications(
        notifications: NotificationMessage[]
      ): Promise<void> {
        const updatedNotifications = notifications.map((n) => ({
          ...n,
          read: 'true',
        }));
        const unreadNotifications = updatedNotifications.filter((n) => !n.read);

        patchState(store, {
          notifications: updatedNotifications,
          unreadCount: unreadNotifications.length,
        });
      },

      async fetchNotifications(userId: string): Promise<void> {
        try {
          const dbRef = ref(db, `/users/${userId}/received_requests/`);
          //    const unreadRef = query(dbRef, orderByChild('read'), equalTo('false'));
          onValue(dbRef, (snapshot) => {
            patchState(store, { isLoading: true });
            const data = snapshot.val() || {};
            const notifications: NotificationMessage[] = Object.values(
              data
            ) as NotificationMessage[];

            const unreaddNotifications = notifications.filter(
              (n) => n.read === 'false'
            );

            patchState(store, {
              notifications: notifications,
              unreadCount: unreaddNotifications.length,
              isLoading: false,
            });
          });
        } catch (error) {
          console.error('Error fetching notifications:', error);
          patchState(store, { isLoading: false });
        }
      },
      async markNotificationAsRead(
        userId: string,
        messageId: string
      ): Promise<void> {
        try {
          const currentState = getState(store);
          const notificationToUpdate = currentState.notifications.find(
            (n) => n.messageId === messageId
          );

          if (!notificationToUpdate) {
            console.error(`Notification with messageId ${messageId} not found`);
            return;
          }

          const requesterId = notificationToUpdate.userId; 
          const dbRef = ref(
            db,
            `/users/${userId}/received_requests/${requesterId}`
          );

          await update(dbRef, { read: 'true' });

          const updatedNotifications = currentState.notifications.map((n) =>
            n.messageId === messageId ? { ...n, read: 'true' } : n
          );

          const unreadNotifications = updatedNotifications.filter(
            (n) => n.read === 'false'
          );

          patchState(store, {
            notifications: updatedNotifications,
            unreadCount: unreadNotifications.length,
          });
        } catch (error) {
          console.error(
            `Unable to update message: ${messageId} for user ${userId}`,
            error
          );
        }
      },
    };
  }),
  withComputed(({ unreadCount }) => ({
    count: computed(() => unreadCount()),
  })),
  withHooks({
    onInit: (store) => {
      const appStore = inject(AppStore);
      const currentUserSignal = computed(() => appStore.currentUser());

      effect(() => {
        const currentUser = currentUserSignal();
        if (currentUser?.uid) {
          store.fetchNotifications(currentUser.uid);
        }
      });
    },
  })
);
