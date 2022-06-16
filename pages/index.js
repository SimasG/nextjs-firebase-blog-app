import {
  collectionGroup,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  Timestamp,
  where,
} from "firebase/firestore";
import { useState } from "react";
import PostFeed from "../components/PostFeed";
import Loader from "../components/Loader";
import { db, postToJSON } from "../lib/firebase";
import Metatags from "../components/Metatags";

// Max post to query per page (for pagination)
const LIMIT = 1;

// *SSR
export async function getServerSideProps(context) {
  const postsQuery = query(
    // Collection Group Queries fetch any subcollections with the same name within the tree of nested documents
    // E.g. now we can run this query for posts without needing the username of every single user who posted
    collectionGroup(db, "posts"),
    where("published", "==", true),
    orderBy("createdAt", "desc"),
    limit(LIMIT)
  );

  const posts = (await getDocs(postsQuery)).docs.map(postToJSON);

  return {
    props: { posts },
  };
}

export default function Home(props) {
  // The initial set of posts is rendered server-side (from getServerSideProps)
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);
  // Setting state to know when we've reached the end of posts list
  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);

    const last = posts[posts.length - 1];

    // "createdAt" timestamp must be a Firebase timestamp. If it isn't, we're converting it to one.
    const cursor =
      typeof last.createdAt === "number"
        ? Timestamp.fromMillis(last.createdAt)
        : last.createdAt;

    const newPostsQuery = query(
      collectionGroup(db, "posts"),
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      startAfter(cursor),
      limit(LIMIT)
    );

    const newPosts = (await getDocs(newPostsQuery)).docs.map((doc) =>
      doc.data()
    );

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };

  return (
    <main>
      <Metatags title="Home Page" />
      <PostFeed posts={posts} />

      {!loading && !postsEnd && (
        <button onClick={getMorePosts}>Load more</button>
      )}

      <Loader show={loading} />
      {postsEnd && "You have reached the end!"}
    </main>
  );
}
