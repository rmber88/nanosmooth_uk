import { FormEvent, useCallback, useState } from "react";
import tw from "twin.macro";
import FormInput from "../FormInput";
import SubmitButton from "../buttons/SubmitButton";

import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "firebase/auth";
import useCurrentUser from "../../hooks/queries/auth/useCurrentUser";
import handleError from "../../utils/handleError";
import toast from "react-hot-toast";
import { useUpdateUserDb } from "../../hooks/mutations/auth/useUpdateUserDb";

export default function Name() {
  const currentUser = useCurrentUser();
  const [name, setName] = useState("");

  const updateUserDb = useUpdateUserDb();

  const updateUserName = useMutation(async (data: { name: string }) => {
    const res = await updateProfile(currentUser!, {
      displayName: data.name,
    });

    return res;
  });
  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      // update the email in firebase auth then update in the firebase doc
      updateUserName.mutate(
        { name },
        {
          onError: handleError,
          onSuccess: () => {
            updateUserDb.mutate(
              {
                name,
              },
              {
                onError: handleError,
                onSuccess: () => {
                  toast.success("Name updated!");
                },
              }
            );
          },
        }
      );
    },
    [name, updateUserDb, updateUserName]
  );

  const isLoading = updateUserDb.isLoading || updateUserName.isLoading;

  const noChangesYet = name.length === 0;

  return (
    <form onSubmit={onSubmit}>
      <FormInput
        tw="mb-5"
        id="name"
        title="name"
        type="name"
        placeholder={currentUser?.displayName ?? ""}
        onChange={(e) => {
          setName(e.target.value);
        }}
        required
      />

      <SubmitButton
        type="submit"
        isLoading={isLoading}
        title="Save Changes"
        disabled={noChangesYet}
      />
    </form>
  );
}
