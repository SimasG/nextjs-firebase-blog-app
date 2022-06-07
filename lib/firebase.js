// **Firebase 8 syntax
// import firebase from "firebase/app";
// import "firebase/auth";
// import "firebase/firestore";
// import "firebase/storage";

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "nextjs-firebase-blog-app-39824.firebaseapp.com",
  projectId: "nextjs-firebase-blog-app-39824",
  storageBucket: "nextjs-firebase-blog-app-39824.appspot.com",
  messagingSenderId: "709707319722",
  appId: "1:709707319722:web:b648fd3e0fd905b84f03d3",
};

// next.js may try to initialize the app twice, that's why we make sure it doesn't here
let app;
if (!firebase.apps.length) {
  app = initializeApp(firebaseConfig);
}

// **Firebase 8 syntax
// export const auth = firebase.auth();
// export const firestore = firebase.firestore();
// export const storage = firebase.storage();

export const db = getFirestore(app);
export const auth = getAuth();
