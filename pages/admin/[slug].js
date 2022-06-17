import styles from "../../styles/Admin.module.css";
import Link from "next/link";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import AuthCheck from "../../components/AuthCheck";
import Metatags from "../../components/Metatags";
import { auth, db } from "../../lib/firebase";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";

export default function AdminPostEdit() {
  return (
    <>
      <Metatags title="Admin Post Page" />
      <AuthCheck>
        <PostManager />
      </AuthCheck>
    </>
  );
}

function PostManager() {
  const [preview, setPreview] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  const postRef = doc(db, "users", auth.currentUser.uid, "posts", slug);
  // Why is the below line identical to "const post = useDocumentData(postRef)[0];"
  // "useDocumentData" provides realtime updates to the post -> if we don't want that,
  // we should be able to use "useDocumentDataOnce" (didn't work for me though)
  const [post] = useDocumentData(postRef);

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm
              postRef={postRef}
              defaultValues={post}
              preview={preview}
            />
          </section>

          <aside>
            <h3>Tools</h3>
            {/* If preview is on -> show "Edit" btn. Else, show "Preview" btn */}
            <button onClick={() => setPreview(!preview)}>
              {preview ? `Edit` : "Preview"}
            </button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="btn-blue">Live View</button>
            </Link>
          </aside>
        </>
      )}
    </main>
  );
}

function PostForm({ postRef, defaultValues, preview }) {
  // Taking functions from 'react-hook-form'
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState,
    formState: { errors },
  } = useForm({
    defaultValues,
    // Whenever any value in the form changes, the form will be re-rendered & re-validated
    mode: "onChange",
  });

  // isValid => true if the conditions we set are met (minLegth, maxLength, etc.)
  // isDirty => true if user has interacted with the form (e.g. typed something in textarea)
  const { isValid, isDirty } = formState;
  console.log(errors);

  // Since "updatePost" is an argument of "handleSubmit" from 'react-hook-form', it has access to
  // the post data (hence {content, published})
  const updatePost = async ({ content, published }) => {
    await updateDoc(postRef, {
      content,
      published,
      updatedAt: serverTimestamp(),
    });

    reset({ content, published });

    toast.success("Post updated successfully!");
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          {/* Don't understand "watch('content')" */}
          <ReactMarkdown>{watch("content")}</ReactMarkdown>
        </div>
      )}
      <div className={preview ? styles.hidden : styles.controls}>
        {/* "{...register("content")}" connects the textarea with post.content via react-hook-form. 
        // Its value will be tracked & validated. Don't understand how it is done tho. */}
        <textarea
          {...register("content", {
            required: true,
            minLength: 10,
            maxLength: 20000,
          })}
        ></textarea>
        {errors.content && errors.content.type === "required" && (
          <p className="text-danger">Content is required</p>
        )}
        {errors.content && errors.content.type === "minLength" && (
          <p className="text-danger">Content is too short</p>
        )}
        {errors.content && errors.content.type === "maxLength" && (
          <p className="text-danger">Content is too long</p>
        )}

        <fieldset>
          <input
            className={styles.checkbox}
            type="checkbox"
            {...register("published")}
          />
          <label>Published</label>
        </fieldset>

        {/* Btn is disabled if it isn't valid (errors exist) or user hasn't interacted with the form yet */}
        <button
          type="submit"
          className="btn-green"
          disabled={!isValid || !isDirty}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
