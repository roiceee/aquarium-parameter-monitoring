import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function requestNotificationPermission() {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
    }
  });
}

interface NotificationResponse {
  success: boolean;
  message: string;
  messageId?: string;
  cooldownMinutes?: number;
  emulator?: boolean;
}

/**
 * Subscribe FCM token to the alerts topic
 * @param token - FCM registration token
 * @returns Promise with subscription result
 */
export async function subscribeToAlertsTopic(
  token: string
): Promise<NotificationResponse> {
  const url = import.meta.env.VITE_SUBSCRIBE_TOPIC_URL;

  if (!url) {
    throw new Error("VITE_SUBSCRIBE_TOPIC_URL is not configured");
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error subscribing to topic:", error);
    throw error;
  }
}
