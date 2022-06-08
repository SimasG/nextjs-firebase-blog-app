import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAyqLZ5P6A1T4OmbRbZorYgGbxLYKpM2XA",
  authDomain: "nextjs-firebase-blog-app-a4b4a.firebaseapp.com",
  projectId: "nextjs-firebase-blog-app-a4b4a",
  storageBucket: "nextjs-firebase-blog-app-a4b4a.appspot.com",
  messagingSenderId: "867473303325",
  appId: "1:867473303325:web:0e5d0571236bf1976763f4",
};

let app;
if (!app) {
  app = initializeApp(firebaseConfig);
}

export const db = getFirestore(app);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
