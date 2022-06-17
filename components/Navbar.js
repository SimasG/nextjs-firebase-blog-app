import { signOut } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../lib/context";
import { auth } from "../lib/firebase";

export default function Navbar() {
  const { user, username } = useContext(UserContext);

  const signOutUser = () => {
    signOut(auth).then(() => toast.success("Logged out!"));
  };

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button className="btn-logo">NXT</button>
          </Link>
        </li>

        {/* user is signed in and has a username */}
        {username && (
          <>
            <li className="push-left">
              <button onClick={signOutUser}>Sign Out</button>
            </li>
            <li>
              <Link href="/admin">
                <button className="btn-blue">Write Posts</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                {/* <Link/> is a wrapper component that pre-fetches some pages & does 
                some other optimizations. For that they use "passHref" prop that needs to be passed
                to a child component. That's why adding a child <a> tag solves the issue.
                "Function components cannot be given refs. Did you mean to use React.forwardRef()?" */}
                <a>
                  <Image
                    src={user?.photoURL || "/hacker.png"}
                    alt="user image"
                    width={50}
                    height={50}
                  />
                </a>
              </Link>
            </li>
          </>
        )}

        {/* user is not signed OR has not created a username */}
        {!username && (
          <li>
            <Link href="/enter">
              <button className="btn-blue">Log In</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
