import { useQuery } from "@tanstack/react-query";
import queryKeys from "../../../constants/querykeys";
import useCurrentUser from "../auth/useCurrentUser";
import { doc, getDoc } from "firebase/firestore";
import { firebaseDb } from "../../../firebase/config";
import { subscriptionData } from "../../../types/db";

export default function useUserSubscriptions(userId?: string) {
  const currentUser = useCurrentUser();
  const id = userId ?? currentUser?.uid;

  return useQuery(
    [queryKeys.subscriptions, id],
    async () => {
      const ref = doc(firebaseDb, "subscriptions", id!);

      const res = await getDoc(ref);

      return { ...res.data(), id: res.id } as subscriptionData;
    },
    {
      enabled: !!id,
    }
  );
}
