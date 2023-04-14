import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_APP_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyBufAmfPzPURBAXr61Iwq_WsWw71wGQ26k",
  authDomain: "quiz-app-65f53.firebaseapp.com",
  projectId: "quiz-app-65f53",
  storageBucket: "quiz-app-65f53.appspot.com",
  messagingSenderId: "540276434353",
  appId: "1:540276434353:web:5bd413ba0f893e15edc990",
};

initializeApp(firebaseConfig);

const db = getFirestore();
export { db };
