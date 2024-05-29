// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: "AIzaSyDQ-PI0mN0c9nLsq1k1peIBY_w_X8nsgjA",
  authDomain: "fitnessapp3-c9eb3.firebaseapp.com",
  databaseURL:"https://fitnessapp3-c9eb3-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fitnessapp3-c9eb3",
  storageBucket: "fitnessapp3-c9eb3.appspot.com",
  messagingSenderId: "1019479987735",
  appId: "1:1019479987735:web:6814e6413fad1e26dcae52"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// the Realtime Database handler
export const db = getDatabase(app);