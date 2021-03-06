import Link from "next/link";

// "admin" is a boolean. If true, show edit buttons, if false, do not.
export default function PostFeed({ posts, admin }) {
  return (
    posts &&
    posts.map((post) => <PostItem post={post} key={post.slug} admin={admin} />)
  );
}

function PostItem({ post, admin = false }) {
  // Naive method to calc word count and read time
  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  return (
    <div className="card">
      <Link href={`/${post.username}`}>
        <a>
          <strong>By @{post.username}</strong>
        </a>
      </Link>
      <Link href={`/${post.username}/${post.slug}`}>
        <a>
          <h2>{post.title}</h2>
        </a>
      </Link>

      <footer>
        <span>
          {wordCount} words. {minutesToRead} min read
        </span>
        <span>❤️ {post.heartCount} Hearts</span>
      </footer>
    </div>
  );
}
