import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, setDoc } from "firebase/firestore";
import { firebaseDb } from "../../../firebase/config";
import queryKeys from "../../../constants/querykeys";

import useCurrentUser from "../../queries/auth/useCurrentUser";
import { userDto } from "../../../types/db";
import handleError from "../../../utils/handleError";
import useCurrentUserDb from "../../queries/auth/useCurrentUserDb";

// Mutation hook
export function useUpdateUserDb(uid?: string) {
  const currentUser = useCurrentUser();
  const currentUserDb = useCurrentUserDb();
  const currentData = currentUserDb.data;
  const queryClient = useQueryClient();

  const { allUsers, currentUser: currentUsers } = queryKeys;

  return useMutation(
    async (data: userDto) => {
      const userDocRef = doc(firebaseDb, "users", uid ?? currentUser?.uid!);
      return await setDoc(
        userDocRef,
        { ...(currentData ?? {}), ...data },
        {
          merge: true,
        }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([uid ? currentUsers : allUsers]);
      },
      onError: (error) => {
        handleError(error);
        throw new Error(`${error}`);
      },
    }
  );
}
