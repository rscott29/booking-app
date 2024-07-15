/* eslint-disable max-len */
import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import {onValueWritten} from "firebase-functions/v2/database";

admin.initializeApp({
  projectId: "booking-app-71ee7",
  storageBucket: "booking-app-71ee7.appspot.com",
  databaseURL: "https://booking-app-71ee7-default-rtdb.firebaseio.com/",
});

const db = admin.database();
const messaging = admin.messaging();

interface User {
  id: string | undefined;
  name: string | undefined;
  email: string | undefined;
  userPhoto: string | undefined;
}
const placeholderImage = "https://graph.facebook.com/10160064646694599/picture";

// Function to get all users
export const getAllUsers = onRequest({cors: true}, async (req, res) => {
  try {
    const allUsers: User[] = [];
    const listAllUsers = async (nextPageToken: string | undefined) => {
      const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
      listUsersResult.users.forEach((userRecord) => {
        const email =
          userRecord.email ||
          (userRecord.providerData.find((provider) => provider.email) || {})
            .email;
        const userData: User = {
          id: userRecord.uid,
          name: userRecord.displayName || "N/A",
          email: email || "N/A",
          userPhoto: userRecord.photoURL || placeholderImage,
        };
        allUsers.push(userData);
      });
      if (listUsersResult.pageToken) {
        await listAllUsers(listUsersResult.pageToken);
      }
    };
    await listAllUsers(undefined);
    logger.info("All users found...");
    res.status(200).send(allUsers);
  } catch (error) {
    logger.error("Error listing all users:", error);
    res.status(500).send("Error listing users.");
  }
});

export const sendFriendRequestNotification = onValueWritten(
  {
    ref: "/users/{userId}/friends/{requesterId}",
  },
  async (event) => {
    const {userId, requesterId} = event.params;
    const eventData = event.data.after.val();

    console.log(`Function triggered for UserId: ${userId}, RequesterId: ${requesterId}, Event: ${JSON.stringify(eventData)}`);

    if (!eventData) {
      console.log("Friend request deleted, no action needed");
      return;
    }

    if (eventData.notificationSent) {
      console.log("Notification already sent, skipping...");
      return;
    }

    try {
      const friendRequestSnapshot = await db.ref(`/users/${userId}/friends/${requesterId}`).once("value");
      const friendRequestData = friendRequestSnapshot.val();

      if (!friendRequestData) {
        console.error("Friend request data not found:", friendRequestData);
        return;
      }

      const username = friendRequestData.requesterUsername || "Someone";

      const receiverSnapshot = await db.ref(`/users/${userId}/notificationToken`).once("value");
      const notificationToken = receiverSnapshot.val();

      if (!notificationToken) {
        console.error("Notification token not found for user:", userId);
        return;
      }

      const message = {
        token: notificationToken,
        notification: {
          title: "New Friend Request",
          body: `${username} sent you a friend request`,
        },
        data: {
          click_action: "FLUTTER_NOTIFICATION_CLICK",
          userId: requesterId,
        },
      };

      await messaging.send(message);
      console.log("Notification sent successfully");

      await db.ref(`/users/${userId}/friends/${requesterId}`).update({notificationSent: true});
    } catch (error) {
      console.error("Error handling notification:", error);
    }
  }
);
