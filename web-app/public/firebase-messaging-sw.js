// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
importScripts(
  "https://www.gstatic.com/firebasejs/12.7.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/12.7.0/firebase-messaging-compat.js"
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
  vapidKey:
    "BJej_joq-UOKjwyTfM0vS9NCRu8JDe-h_nibElmWKEtEdNEwrbBUEO0PuD73SP-YXFMObcwjYbxulscXbNqbH6M",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

//if you want to customize notifications that are received in the background (Web app is closed or not in browser focus) then you can implement this optional method.
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  self.registration.showNotification(payload);
});
