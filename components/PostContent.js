import Link from "next/link";
import { ReactMarkdown } from "react-markdown";

export default function PostContent({ post }) {
  // If "createdAt"'s type is "number", convert it to a JS date object, else if it's a Firebase timestamp,
  // convert it to a JS date object as well (using Firestore's built it "toDate()" method)
  const createdAt =
    typeof post?.createdAt === "number"
      ? new Date(post.createdAt)
      : post.createdAt.toDate();

  return (
    <div className="card">
      <h1>{post?.title}</h1>
      <span className="text-sm">
        Written by{" "}
        <Link href={`/${post.username}/`}>
          <a className="post-info">@{post.username}</a>
        </Link>{" "}
        on {createdAt.toISOString()}
      </span>

      <ReactMarkdown>{post?.content}</ReactMarkdown>
    </div>
  );
}
