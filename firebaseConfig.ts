import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB6kk4x2j_PcN4iLYoNhe75_rCSvNOZiLI",
  authDomain: "fitcircle-app.firebaseapp.com",
  projectId: "fitcircle-app",
  storageBucket: "fitcircle-app.firebasestorage.app",
  messagingSenderId: "384449208728",
  appId: "1:384449208728:web:1b0892ab1b7b9e664ecbed",
  measurementId: "G-HYT98N4F2J"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);