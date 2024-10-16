/* eslint-disable max-len */
import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import {onValueWritten} from "firebase-functions/v2/database";
import {v4 as uuidv4} from "uuid";

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
    ref: "/users/{userId}/sent_requests/{requesterId}",
  },
  async (event) => {
    const {userId, requesterId} = event.params;
    const eventData = event.data.after.val();

    console.log(`Function triggered for UserId: ${userId}, RequesterId: ${requesterId}, Event: ${JSON.stringify(eventData)}`);

    // Check if the friend request has been deleted
    if (!eventData) {
      console.log("Friend request deleted, no action needed");
      return;
    }

    // Check if the notification has already been sent
    if (eventData.notificationSent) {
      console.log("Notification already sent, skipping...");
      return;
    }

    try {
      // Fetch the requester's friend request data from the sender's 'sent_requests' node
      const friendRequestSnapshot = await db.ref(`/users/${userId}/sent_requests/${requesterId}`).once("value");
      const friendRequestData = friendRequestSnapshot.val();

      if (!friendRequestData) {
        console.error("Friend request data not found for sender:", friendRequestData);
        return;
      }

      // Extract the username of the sender to be used in the notification
      const username = friendRequestData.requesterUsername || "Someone";

      const userRecord = await admin.auth().getUser(userId);
      const userPhoto = userRecord.photoURL || placeholderImage;

      // Fetch the notification token of the receiver from their 'notificationToken' field
      const receiverSnapshot = await db.ref(`/users/${requesterId}/notificationToken`).once("value");
      const notificationToken = receiverSnapshot.val();

      if (!notificationToken) {
        console.error("Notification token not found for user:", requesterId);
        return;
      }

      // Construct the notification message
      const message = {
        token: notificationToken,
        data: {
          messageId: uuidv4(),
          read: "false",
          title: "New Friend Request",
          userPhoto: userPhoto,
          body: `${username} sent you a friend request`,
          notification_type: "friend_request",
          userId: userId,
        },
      };

      // Send the notification via Firebase Cloud Messaging (FCM)
      await messaging.send(message);
      console.log("Notification sent successfully");
      await db.ref(`/users/${requesterId}/received_requests/${userId}`).set(message.data);
    } catch (error) {
      console.error("Error handling notification:", error);
    }
  }
);
