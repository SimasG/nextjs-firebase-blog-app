// **Data of this page changes often but doesn't really need to be rendered in realtime -> hence SSR
// ** aka the page will be re-generated (re-rendered?) each time it receives a request

import UserProfile from "../../components/UserProfile";
import PostFeed from "../../components/PostFeed";
import { db, getUserWithUsername, postToJSON } from "../../lib/firebase";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query as fireQuery,
  where,
} from "firebase/firestore";

// ** SSR: next.js will run this func on the server anytime this page is requested
// { query } comes from built-in "context" parameter (aka "context.query")
export async function getServerSideProps({ query }) {
  const { username } = query;

  const userDoc = await getUserWithUsername(username);

  // Retrieving posts that the username has authored
  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();
    const postsRef = collection(db, "posts");
    const q = fireQuery(
      postsRef,
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(5)
    );
    posts = (await getDocs(q)).docs.map(postToJSON);
  }

  return {
    props: { user, posts },
  };
}

export default function UserProfilePage({ user, posts }) {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  );
}
