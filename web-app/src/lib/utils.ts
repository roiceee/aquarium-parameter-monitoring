import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { firestore } from "./firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Request notification permission from the user
 * @returns Promise<NotificationPermission>
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) {
    console.error("This browser does not support notifications");
    return "denied";
  }

  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    console.log("Notification permission granted.");
  } else {
    console.log("Notification permission denied.");
  }
  return permission;
}

/**
 * Store FCM token in Firestore
 * @param token - FCM registration token
 * @returns Promise<void>
 */
export async function storeFCMToken(token: string): Promise<void> {
  try {
    // Use token as document ID to prevent duplicates
    const tokenRef = doc(firestore, "fcmTokens", token);

    await setDoc(
      tokenRef,
      {
        token,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        active: true,
      },
      { merge: true }
    );

    console.log("FCM token stored successfully in Firestore");
  } catch (error) {
    console.error("Failed to store FCM token:", error);
    throw error;
  }
}
