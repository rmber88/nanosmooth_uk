import { getAuth } from "firebase/auth";
import { firebaseApp } from "../../../firebase/config";

export default function useCurrentUser() {
  const auth = getAuth(firebaseApp);
  return auth.currentUser;
}
