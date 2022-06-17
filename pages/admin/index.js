import styles from "../../styles/Admin.module.css";
import {
  collection,
  doc,
  orderBy,
  query,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import AuthCheck from "../../components/AuthCheck";
import PostFeed from "../../components/PostFeed";
import Metatags from "../../components/Metatags";
import { auth, db } from "../../lib/firebase";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { UserContext } from "../../lib/context";
import kebabCase from "lodash.kebabcase";
import toast from "react-hot-toast";

export default function AdminPostsPage() {
  return (
    <main>
      <Metatags title="Admin Page" />
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}

function PostList() {
  const postsRef = collection(db, "users", auth.currentUser.uid, "posts");
  const q = query(postsRef, orderBy("createdAt", "desc"));

  // Aren't we fetching data from the db? How is this not async?
  // Why is "snapshot" declared in an array?
  const [snapshot] = useCollection(q);
  const posts = snapshot?.docs.map((doc) => doc.data());

  return (
    <>
      <h1>Manage your Posts</h1>
      {/* Sending "admin" as true -> edit buttons will be shown */}
      <PostFeed posts={posts} admin />
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title));

  // Validate title length
  const isValid = title.length > 3 && title.length < 100;

  // Create a new post in Firestore
  const createPost = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    const postRef = doc(db, "users", uid, "posts", slug);

    // Best practice: give all fields a default value here
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: "# Hello world!",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await setDoc(postRef, data);

    toast.success("Post Created!");

    router.push(`/admin/${slug}`);
  };

  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My Awesome Article!"
        className={styles.input}
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      {/* If isValid is false, the btn will be disabled */}
      <button type="submit" disabled={!isValid} className="btn-green">
        Create New Post
      </button>
    </form>
  );
}
