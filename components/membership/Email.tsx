import { FormEvent, useCallback, useEffect, useState } from "react";
import tw from "twin.macro";
import FormInput from "../FormInput";

import { useMutation } from "@tanstack/react-query";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
} from "firebase/auth";
import useCurrentUser from "../../hooks/queries/auth/useCurrentUser";
import handleError from "../../utils/handleError";
import toast from "react-hot-toast";
import { useUpdateUserDb } from "../../hooks/mutations/auth/useUpdateUserDb";

type EmailProps = {
  submitTrigger?: boolean;
  onSubmitSuccess?: () => void;
};

export async function reauthenticate(currentUser: any, password: string) {
  const credential = EmailAuthProvider.credential(currentUser.email, password);
  await reauthenticateWithCredential(currentUser, credential);
}

export default function Email({ submitTrigger, onSubmitSuccess }: EmailProps) {
  const currentUser = useCurrentUser();
  const [email, setEmail] = useState("");

  const updateUserDb = useUpdateUserDb();

  const updateUserEmail = useMutation(
    async (data: { email: string }) => {
      if (!currentUser) {
        throw new Error("User not authenticated");
      }
      const res = await updateEmail(currentUser, data.email);
      return res;
    },
    {
      onError: async (error: any) => {
        if (error.code === "auth/requires-recent-login") {
          try {
            toast.error(
              "Please logout and sign in again to update your email."
            );
          } catch (reauthError) {
            handleError(reauthError);
            toast.error("Reauthentication failed. Please try again.");
          }
        } else {
          handleError(error);
        }
      },
    }
  );

  useEffect(() => {
    if (submitTrigger) {
      const form = document.getElementById("email-form");
      form?.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  }, [submitTrigger]);

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      if (!email) {
        toast.error("Please enter a valid email address");
        return;
      }
      updateUserEmail.mutate(
        { email },
        {
          onError: handleError,
          onSuccess: () => {
            updateUserDb.mutate(
              { email },
              {
                onError: handleError,
                onSuccess: () => {
                  toast.success("Email updated!");
                  onSubmitSuccess?.();
                },
              }
            );
          },
        }
      );
    },
    [email, updateUserDb, updateUserEmail, onSubmitSuccess]
  );

  const isLoading = updateUserDb.isLoading || updateUserEmail.isLoading;

  return (
    <form id="email-form" onSubmit={onSubmit}>
      <FormInput
        tw=" mb-5 mt-8 w-[70%]"
        id="email"
        title="New Email"
        type="email"
        placeholder={currentUser?.email ?? "Enter your new email"}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
    </form>
  );
}
