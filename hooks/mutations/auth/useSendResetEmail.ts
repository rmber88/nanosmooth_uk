import { getAuth, sendPasswordResetEmail, User } from "firebase/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function useSendResetPasswordMail() {
  const q = useQueryClient();
  const auth = getAuth();

  return useMutation((email: string) => sendPasswordResetEmail(auth, email));
}
