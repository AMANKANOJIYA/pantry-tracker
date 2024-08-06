import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASURMENT_ID,
};

// const firebaseConfig = {
//   apiKey: "AIzaSyBhrYJIb5nAII5mecrtp9WXAUCtADGeG88",
//   authDomain: "pantry-app-b1511.firebaseapp.com",
//   databaseURL: "https://pantry-app-b1511-default-rtdb.firebaseio.com",
//   projectId: "pantry-app-b1511",
//   storageBucket: "pantry-app-b1511.appspot.com",
//   messagingSenderId: "168319517543",
//   appId: "1:168319517543:web:8a533bc76a4cacfc3fe5c2",
//   measurementId: "G-FGPFNVTGJW",
// };

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database };
