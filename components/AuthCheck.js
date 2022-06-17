import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";

// Component that displays its children only if the user is logged in (aka an auth token is available)
export default function AuthCheck(props) {
  const { username } = useContext(UserContext);

  return username
    ? props.children
    : props.fallback || <Link href="/enter">You must be signed in</Link>;
}
