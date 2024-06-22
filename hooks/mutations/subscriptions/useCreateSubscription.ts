import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { firebaseDb } from "../../../firebase/config";
import queryKeys from "../../../constants/querykeys";
import { subscriptionDto } from "../../../types/db";
import useCurrentUser from "../../queries/auth/useCurrentUser";

export default function useCreateSubscription() {
  const q = useQueryClient();
  const currentUser = useCurrentUser();

  return useMutation(
    async (data: subscriptionDto) => {
      if (!currentUser?.uid) {
        return;
      }

      console.log("creating subscription")

      const ref = doc(firebaseDb, `subscriptions`, currentUser?.uid);
      const res = await setDoc(ref, data, {
        merge: true,
      });

      return res;
    },
    {
      onSuccess: () => q.invalidateQueries([queryKeys.subscriptions]),
    }
  );
}
