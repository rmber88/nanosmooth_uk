import { getAuth, signInWithEmailAndPassword, User } from "firebase/auth";
import { firebaseApp } from "../../../firebase/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginDto } from "../../../types/db";

export default function useLogin({ email, password }: loginDto) {
  const q = useQueryClient();
  const auth = getAuth(firebaseApp);

  return useMutation(() => signInWithEmailAndPassword(auth, email, password), {
    onSuccess: () => q.invalidateQueries(["current-user"]),
  });
}
