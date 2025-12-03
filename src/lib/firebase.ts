import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBwZSGGek_bVCuJw08hgkkpcLc4ybA12Gs",
  authDomain: "aquarium-monitoring-bd878.firebaseapp.com",
  databaseURL:
    "https://aquarium-monitoring-bd878-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "aquarium-monitoring-bd878",
  storageBucket: "aquarium-monitoring-bd878.firebasestorage.app",
  messagingSenderId: "1037054047078",
  appId: "1:1037054047078:web:a453f7f04021b85f808ea7",
  measurementId: "G-5GT6ELH2CQ",
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);
export default app;
