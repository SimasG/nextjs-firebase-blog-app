import styles from "../../styles/Post.module.css";
import PostContent from "../../components/PostContent";
import {
  db,
  firestore,
  getUserWithUsername,
  postToJSON,
} from "../../lib/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";

export async function getStaticProps({ params }) {
  //   console.log(params);
  const { username, slug } = params;
  const userDoc = getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    //** Have to make sure I'm only referring to the posts made by the current user
    const postRef = doc(db, "posts", slug);
  }
}

export default function Post(props) {
  return <main></main>;
}
