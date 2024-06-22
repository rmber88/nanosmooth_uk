import { QueryClient } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "../../../firebase/config";

export default function useSignOut() {
  const queryClient = new QueryClient();
  const auth = getAuth(firebaseApp);
  const signOut = () => {
    queryClient.resetQueries();
    auth.signOut();
    console.log("Signed out");
  };

  return { signOut };
}
