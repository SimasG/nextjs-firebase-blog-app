import { auth, db, provider } from "../lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import Image from "next/image";
import toast from "react-hot-toast";
import { useContext, useState, useEffect, useCallback } from "react";
import { UserContext } from "../lib/context";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import debounce from "lodash.debounce";

export default function Enter() {
  const { user, username } = useContext(UserContext);

  // 1. User signed out <SignInButton/>
  // 2. User signed in but no username <UsernameForm/>
  // 3. User signed in and has username <SignOutButton/>
  return (
    <main>
      {user ? (
        username ? (
          <SignOutButton />
        ) : (
          <>
            <UsernameForm />
          </>
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
}

// Google auth
function SignInButton() {
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <Image
        // why do I need to declare logo's height & width twice (in class & props)?
        className="logo"
        src="/google.png"
        alt="google logo"
        width={30}
        height={30}
      />
      <span>Sign In With Google</span>
    </button>
  );
}

function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  // **"username" seems useless here
  const { user, username } = useContext(UserContext);

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  const onChange = (e) => {
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    // if val passes the regular expression test
    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  // check the db for username match after each debounced change
  // useCallback is required for debounce to work (Every time component re-renders, react creates
  // a new function object for each func which will not be debounced. With useCallback, new function
  // object will not be created and debounce will work (referential equality))
  // debounce waits for 500ms after the user stops typing before executing the db read
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = doc(db, "usernames", username);
        const docSnap = await getDoc(ref);
        console.log("Firebase read executed!");
        setIsValid(!docSnap.exists());
        setLoading(false);
      }
    }, 500),
    []
  );

  const onSubmit = async (e) => {
    e.preventDefault();

    const userDocRef = doc(db, "users", user.uid);
    const usernameDocRef = doc(db, "usernames", formValue);

    // commit both docs together as a batch write
    const batch = writeBatch(db);
    batch.set(userDocRef, {
      username: formValue,
      photoURL: user.photoURL,
      displayname: user.displayName,
    });
    batch.set(usernameDocRef, { uid: user.uid });

    await batch.commit();
  };

  return (
    <section>
      <h3>Select Username</h3>
      <form onSubmit={onSubmit}>
        <input
          name="username"
          placeholder="username"
          value={formValue}
          onChange={onChange}
        />
        <UsernameMessage
          username={formValue}
          isValid={isValid}
          loading={loading}
        />
        {/* button disabled while isValid = false */}
        <button type="submit" className="btn-green" disabled={!isValid}>
          Choose
        </button>
      </form>

      <h3>Debug State</h3>
      <div>
        Username: {formValue}
        <br />
        Loading: {loading.toString()}
        <br />
        Username Valid: {isValid.toString()}
      </div>
    </section>
  );
}

function SignOutButton() {
  const signOutUser = () => {
    signOut(auth).then(() => toast.success("Logged out!"));
  };

  return <button onClick={signOutUser}>Sign Out</button>;
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username.length < 3 && !isValid) {
    return <p className="text-danger">This username is too short!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">This username is taken!</p>;
  } else {
    return <p></p>;
  }
}
