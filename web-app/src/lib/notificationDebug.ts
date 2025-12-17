/**
 * Utility functions for debugging FCM notifications
 */

/**
 * Check if notifications are supported and get current permission status
 */
export function checkNotificationSupport() {
  const support = {
    supported: "Notification" in window,
    permission:
      "Notification" in window ? Notification.permission : "unsupported",
    serviceWorkerSupported: "serviceWorker" in navigator,
    fcmSupported: "PushManager" in window,
  };

  console.log("=== Notification Support Check ===");
  console.log("Notifications supported:", support.supported);
  console.log("Current permission:", support.permission);
  console.log("Service Worker supported:", support.serviceWorkerSupported);
  console.log("FCM/Push supported:", support.fcmSupported);
  console.log("==================================");

  return support;
}

/**
 * Test notification display (must have permission granted)
 */
export async function testNotification() {
  if (!("Notification" in window)) {
    console.error("Notifications not supported");
    return false;
  }

  if (Notification.permission !== "granted") {
    console.error("Notification permission not granted");
    return false;
  }

  try {
    const notification = new Notification("Test Notification", {
      body: "This is a test notification from Aquarium Monitor",
      icon: "/pwa-192x192.png",
      tag: "test-notification",
    });

    notification.onclick = () => {
      console.log("Test notification clicked");
      notification.close();
    };

    console.log("Test notification shown successfully");
    return true;
  } catch (error) {
    console.error("Failed to show test notification:", error);
    return false;
  }
}

/**
 * Log all service worker registrations
 */
export async function checkServiceWorkers() {
  if (!("serviceWorker" in navigator)) {
    console.error("Service Workers not supported");
    return;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    console.log("=== Service Worker Registrations ===");
    console.log("Total registrations:", registrations.length);

    registrations.forEach((registration, index) => {
      console.log(`Registration ${index + 1}:`, {
        scope: registration.scope,
        active: !!registration.active,
        waiting: !!registration.waiting,
        installing: !!registration.installing,
      });
    });
    console.log("====================================");

    return registrations;
  } catch (error) {
    console.error("Failed to get service worker registrations:", error);
  }
}

// Expose to window for easy browser console access
if (typeof window !== "undefined") {
  interface NotificationDebugTools {
    checkSupport: typeof checkNotificationSupport;
    testNotification: typeof testNotification;
    checkServiceWorkers: typeof checkServiceWorkers;
  }

  (
    window as typeof window & { notificationDebug: NotificationDebugTools }
  ).notificationDebug = {
    checkSupport: checkNotificationSupport,
    testNotification,
    checkServiceWorkers,
  };
  console.log(
    "💡 Notification debug tools available: window.notificationDebug"
  );
}
