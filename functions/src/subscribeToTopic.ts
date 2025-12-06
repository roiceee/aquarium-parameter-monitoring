import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import {getMessaging} from "firebase-admin/messaging";
import {TOPIC} from "./constants";

/**
 * HTTP endpoint to subscribe FCM token to alerts topic
 */
export const subscribeToTopic = onRequest(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const {token} = req.body;

  if (!token) {
    res.status(400).send("Missing registration token");
    return;
  }

  // Check if running in emulator (no Pub/Sub emulator available)
  const isEmulator = process.env.FUNCTIONS_EMULATOR === "true";

  if (isEmulator) {
    logger.info("Emulator mode: Token received (skipping FCM subscription)", {
      token: token.substring(0, 20) + "...",
      structuredData: true,
    });
    res.status(200).json({
      success: true,
      message: "Token received (emulator mode)",
      emulator: true,
    });
    return;
  }

  // Production mode - actually subscribe to FCM topic
  try {
    await getMessaging().subscribeToTopic(token, TOPIC);
    logger.info("Successfully subscribed to FCM topic", {
      token: token.substring(0, 20) + "...",
      topic: TOPIC,
      structuredData: true,
    });

    res.status(200).json({
      success: true,
      message: "Successfully subscribed to alerts topic",
    });
  } catch (error) {
    logger.error("Error subscribing to topic", {
      error: error instanceof Error ? error.message : String(error),
      structuredData: true,
    });
    res.status(500).json({
      success: false,
      message: "Error subscribing to topic",
    });
  }
});
