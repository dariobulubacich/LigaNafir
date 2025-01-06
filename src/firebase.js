import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebase = {
  apiKey: "AIzaSyB6A6Cyzyl529b2MEYIV-JNun51BYGHsIw",
  authDomain: "appinspectores-6c2d6.firebaseapp.com",
  projectId: "appinspectores-6c2d6",
  storageBucket: "appinspectores-6c2d6.firebasestorage.app",
  messagingSenderId: "644900115423",
  appId: "1:644900115423:web:ef4c01829dffdcec222a6a",
};

const app = initializeApp(firebase);
export const auth = getAuth(app);
export const db = getFirestore(app);
