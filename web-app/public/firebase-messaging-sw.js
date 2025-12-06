// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyB2MTe7Dgrl0NC2eUBDdzjikaLO_bYJYV4",
  authDomain: "aquarium-monitoring-bd878.firebaseapp.com",
  databaseURL:
    "https://aquarium-monitoring-bd878-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "aquarium-monitoring-bd878",
  storageBucket: "aquarium-monitoring-bd878.firebasestorage.app",
  messagingSenderId: "1037054047078",
  appId: "1:1037054047078:web:a453f7f04021b85f808ea7",
  measurementId: "G-5GT6ELH2CQ",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message:",
    payload
  );

  const notificationTitle = payload.notification?.title || "Aquarium Alert";
  const notificationOptions = {
    body: payload.notification?.body || "New notification received",
    icon: payload.notification?.icon || "/pwa-192x192.png",
    data: {
      url: payload.fcmOptions?.link || "https://aquamonitor.roice.xyz",
      ...payload.data,
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// // Handle notification click
// self.addEventListener("notificationclick", (event) => {
//   console.log("[firebase-messaging-sw.js] Notification clicked:", event);

//   event.notification.close();

//   // Open the app URL
//   const urlToOpen =
//     event.notification.data?.url || "https://aquamonitor.roice.xyz";

//   event.waitUntil(
//     clients
//       .matchAll({ type: "window", includeUncontrolled: true })
//       .then((clientList) => {
//         // Check if a window is already open
//         for (const client of clientList) {
//           if (client.url === urlToOpen && "focus" in client) {
//             return client.focus();
//           }
//         }
//         // If no window is open, open a new one
//         if (clients.openWindow) {
//           return clients.openWindow(urlToOpen);
//         }
//       })
//   );
// });
