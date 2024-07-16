// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging-compat.js')

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyDKKKq2aGrcP9MwnJbMX9Rw-JguZ5ZqOQo",

    authDomain: "booking-app-71ee7.firebaseapp.com",
  
    databaseURL: "https://booking-app-71ee7-default-rtdb.firebaseio.com",
  
    projectId: "booking-app-71ee7",
  
    storageBucket: "booking-app-71ee7.appspot.com",
  
    messagingSenderId: "137744105738",
  
    appId: "1:137744105738:web:672e10930e2d66b3bfbaf3",
  
    measurementId: "G-XBT7T9R8BT"
  
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload.data);
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
