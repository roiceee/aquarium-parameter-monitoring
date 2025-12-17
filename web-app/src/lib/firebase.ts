import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);
export const messaging = getMessaging(app);
export const firestore = getFirestore(app);
export const getTokenFunction = () =>
  getToken(messaging, {
    vapidKey:
      "BJej_joq-UOKjwyTfM0vS9NCRu8JDe-h_nibElmWKEtEdNEwrbBUEO0PuD73SP-YXFMObcwjYbxulscXbNqbH6M",
  });

// Listen for foreground messages (when app is open)
onMessage(messaging, (payload) => {
  console.log("Message received in foreground:", payload);
  const notificationTitle = payload.notification?.title || "Aquarium Alert";
  const notificationOptions: NotificationOptions = {
    body: payload.notification?.body,
    icon: "/pwa-192x192.png",
    tag: "aquarium-notification",
    requireInteraction: true,
  };

  if (Notification.permission === "granted") {
    new Notification(notificationTitle, notificationOptions);
  } else {
    console.log("Notification permission not granted");
  }
});

export default app;
