import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  limit,
  getDocs,
  FieldValue,
} from "@firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

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

// Auth exports
export const auth = getAuth();
export const provider = new GoogleAuthProvider();

// Firestore (db) exports
export const db = getFirestore(app);

// Storage exports
export const storage = getStorage(app);
// Firebase event listener that tells us the progress of the file upload to Storage
export const STATE_CHANGED = storage.STATE_CHANGED;

// Helper functions
// Automatically saves a timestamp for each new document on a server -> more reliable than JS dates
// because all timestamps are guaranteed to be in the same format (as it doesn't rely on user's
// client-side clock)
// ** Seems like I don't even need to export serverTimestamp here
// export const serverTimestamp = FieldValue.serverTimestamp;

// Gets a users/{uid} document with username
export async function getUserWithUsername(username) {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", username), limit(1));
  const userDoc = (await getDocs(q)).docs[0];
  return userDoc;
}

// Converting Firebase docs into JSON (each doc originally has a Firestore stamp on it)
export function postToJSON(doc) {
  const data = doc.data();
  const uid = doc.id;
  return {
    ...data,
    // Firebase timestamp is not serializable to JSON
    // converting Firebase timestamps into numeric timestamps (JSON-friendly)
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
    uid,
  };
}
