// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
importScripts(
  "https://www.gstatic.com/firebasejs/12.6.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/12.6.0/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyBwZSGGek_bVCuJw08hgkkpcLc4ybA12Gs",
  authDomain: "aquarium-monitoring-bd878.firebaseapp.com",
  databaseURL:
    "https://aquarium-monitoring-bd878-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "aquarium-monitoring-bd878",
  storageBucket: "aquarium-monitoring-bd878.firebasestorage.app",
  messagingSenderId: "1037054047078",
  appId: "1:1037054047078:web:a453f7f04021b85f808ea7",
  measurementId: "G-5GT6ELH2CQ",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

// Handle background messages (when app is closed or not in focus)
// messaging.onBackgroundMessage((payload) => {
//   console.log(
//     "[firebase-messaging-sw.js] Received background message",
//     payload
//   );

//   const notificationTitle = payload.notification?.title || "Aquarium Alert";
//   const notificationOptions = {
//     body: payload.notification?.body || "Check your aquarium sensors",
//     icon: payload.notification?.icon || "/pwa-192x192.png",
//     badge: "/pwa-64x64.png",
//     tag: payload.notification?.tag || "aquarium-notification",
//     requireInteraction: true,
//     data: payload.data,
//   };

//   return self.registration.showNotification(
//     notificationTitle,
//     notificationOptions
//   );
// });
