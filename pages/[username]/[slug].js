import styles from "../../styles/Post.module.css";
import PostContent from "../../components/PostContent";
import AuthCheck from "../../components/AuthCheck";
import { db, getUserWithUsername, postToJSON } from "../../lib/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import {
  doc,
  collection,
  getDocs,
  limit,
  orderBy,
  where,
  query,
  collectionGroup,
} from "firebase/firestore";
import Metatags from "../../components/Metatags";
import Link from "next/link";
import HeartButton from "../../components/HeartButton";

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    const postsRef = collection(db, "users", userDoc.id, "posts");
    const q = query(
      postsRef,
      where("slug", "==", slug),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    post = (await getDocs(q)).docs.map(postToJSON)[0];

    // Creating a path(e.g. "users/123asd123/posts/321dsa321") to make it easier to re-fetch the data on
    // the client-side when we want to hydrate it to realtime data(what does this mean exactly?)
    // path = postsRef.path;
    // path = "users/h7qOnh3mHWQx0LcPRZAGNpMc2Y72/posts/UGIk0KXHNZbF4HXUNBwh";
    path = `users/${userDoc.id}/posts/${post.uid}`;
  }

  return {
    props: { post, path },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10,
  };
}

// Telling next.js which paths to pre-render using "getStaticPaths"
// Otherwise, all possible paths would be pre-rendered (I think so) -> inefficient
export async function getStaticPaths() {
  // Selecting all the posts in the db
  const snapshot = await getDocs(query(collectionGroup(db, "posts")));

  const paths = snapshot.docs.map((doc) => {
    const { username, slug } = doc.data();

    return {
      // Array of all params for paths (URLs) to pre-render (i.e. username/slug)
      params: { username, slug },
    };
  });

  return {
    // With traditional SSG, there would be no way to re-run this func once new posts are created.
    // However, with next.js, we can specify a fallback.
    // With "fallback: "blocking"", once we navigate to a page that hasn't been rendered yet, next.js
    // falls backs to regular SSR (aka next.js will render & cache the new page to a CDN)
    // With regular SSG, the only way to render new pages would be to redeploy the application (cumbersome)
    fallback: "blocking",
    paths,
  };
}

// Taking in the props from "getStaticProps" (hence the name) above
export default function Post(props) {
  // Hydrating from server-rendered content to realtime data
  const postRef = doc(db, props.path);

  // ** Don't understand this bit
  //   Getting feed to realtime data (in realtime?)
  const [realtimePost] = useDocumentData(postRef);

  // Defaulting to realtime data (newly created data?).
  // If not there, move to pre-rendered data on the server.
  const post = realtimePost || props.post;

  //   A page that's server-rendered & SEO-friendly BUT also interactive & realtime
  return (
    <main className={styles.container}>
      <Metatags title={post.title} description={post.title} />

      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} ❤️</strong>
        </p>

        <AuthCheck
          fallback={
            <Link href="/enter">
              <button>❤️ Sign Up</button>
            </Link>
          }
        >
          <HeartButton postRef={postRef} />
        </AuthCheck>
      </aside>
    </main>
  );
}
