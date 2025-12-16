import {setGlobalOptions} from "firebase-functions";
import {initializeApp} from "firebase-admin/app";

// Initialize Firebase Admin
export const app = initializeApp();

// Global options for cost control
setGlobalOptions({maxInstances: 3});

// Export all Cloud Functions
export {sendNotification} from "./sendNotification";
export {subscribeToTopic} from "./subscribeToTopic";
export {checkSensorThresholds} from "./checkSensorThresholds";
export {scheduledDataLogger} from "./scheduledDataLogger";
