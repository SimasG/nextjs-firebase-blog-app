import { doc, getDoc, writeBatch } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { auth, db, increment } from "../lib/firebase";

// Allowing logged in users to heart/unheart others' posts
export default function HeartButton({ postRef }) {
  // Listen to heart document (whether it exists or not)
  const heartRef = doc(postRef, "hearts", auth.currentUser.uid);
  //   Does it have to be "const [heartDoc] = useDocument(heartRef)"
  //   const [heartDoc] = getDoc(heartRef);
  const [heartDoc] = useDocument(heartRef);
  console.log(heartRef);

  //   Create user-to-post relationship
  const batch = writeBatch(db);

  const addHeart = async () => {
    const uid = auth.currentUser.uid;

    // Batch writing data => either writing all docs suceeds or fails (even if only one failed)
    // { uid } => { uid: uid }
    batch.set(heartRef, { uid });
    batch.update(postRef, { heartCount: increment(1) });

    await batch.commit();
  };

  const removeHeart = async () => {
    batch.delete(heartRef);
    batch.update(postRef, { heartCount: increment(-1) });

    await batch.commit();
  };

  return heartDoc?.exists ? (
    <button onClick={removeHeart}>💔 Unheart</button>
  ) : (
    <button onClick={addHeart}>💗 Heart</button>
  );
  //   return <h2>Heart Btn</h2>;
}
