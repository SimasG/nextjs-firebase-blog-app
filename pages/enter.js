import { auth, provider } from "../lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import Image from "next/image";
import toast from "react-hot-toast";
import { useContext } from "react";
import { UserContext } from "../lib/context";

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
          <UsernameForm />
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
        width={20}
        height={20}
      />
      Sign In With Google
    </button>
  );
}

function UsernameForm() {}

function SignOutButton() {
  const signOutUser = () => {
    signOut(auth).then(() => toast.success("Logged out!"));
  };

  return <button onClick={signOutUser}></button>;
}
