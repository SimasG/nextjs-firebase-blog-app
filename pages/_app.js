import { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import { UserContext } from "../lib/context";
import "../styles/globals.css";
import { useUserData } from "../lib/hooks";

function MyApp({ Component, pageProps }) {
  const { user, username } = useUserData();
  console.log(username);
  // OR
  // const userData = useUserData();

  return (
    <UserContext.Provider value={{ user, username }}>
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  );
}

export default MyApp;
