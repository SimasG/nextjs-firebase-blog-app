// "useAuthState" hook returns an object populated with the user object if user is authenticated.
// Otherwise, it returns null.
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "./firebase";

export function useUserData() {
  // why is user declared in square brackets []?
  const [user] = useAuthState(auth);

  const [username, setUsername] = useState(null);

  useEffect(() => {
    // unsubing from real-time data updates(?)
    let unsub;

    if (user) {
      const ref = doc(db, "users", user.uid);
      unsub = onSnapshot(ref, (doc) => {
        setUsername(doc.data()?.username);
      });
    } else {
      setUsername(null);
    }

    return unsub;
  }, [user]);

  return { user, username };
}
