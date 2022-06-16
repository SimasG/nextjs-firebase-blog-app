import styles from "../../styles/Post.module.css";
import PostContent from "../../components/PostContent";
import { db, getUserWithUsername, postToJSON } from "../../lib/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import {
  doc,
  collection,
  getDoc,
  getDocs,
  limit,
  orderBy,
  where,
  query,
  collectionGroup,
} from "firebase/firestore";
import Metatags from "../../components/Metatags";

export async function getStaticProps({ params }) {
  //   console.log(params);
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    //** Have to make sure I'm only referring to the posts made by the current user
    const postsRef = collection(db, "users", userDoc.id, "posts");
    const q = query(
      postsRef,
      where("slug", "==", slug),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    // post = postToJSON(await getDoc(q));
    post = (await getDocs(q)).docs.map(postToJSON)[0];
    console.log("post:");
    console.log(post);

    // Creating a path(is it a URL?) to make it easier to re-fetch the data on the client-side
    // when we want to hydrate it to realtime data(what does this mean exactly?)
    path = postsRef.path;
    // path = "test path";
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
// **Don't understand "getStaticPaths()" yet
export async function getStaticPaths() {
  // Selecting all the posts in the db
  // const snapshot = await getDocs(query(collectionGroup(db, "posts")));

  // const paths = snapshot.docs.map((doc) => {
  //   const { username, slug } = doc.data();

  //   return {
  //     params: { username, slug },
  //   };
  // });

  const paths = [
    "/testUsername1/testSlug1",
    "/testUsername2/testSlug2",
    "/testUsername3/testSlug3",
  ];

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
  const postRef = doc(props.path);
  //   Getting feed to realtime data (in realtime?)
  const [realtimePost] = useDocumentData(postRef);

  //   Defaulting to realtime data. If not there, move to pre-rendered data on the server.
  const post = realtimePost || props.post;

  //   A page that's server-rendered & SEO-friendly BUT also interactive & realtime
  return (
    <main className={styles.container}>
      <h1>TESTYY</h1>
      {/* <Metatags title={post.title} />
      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} ❤️</strong>
        </p>
      </aside> */}
    </main>
  );
}
