import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { firebaseDb } from "../../../firebase/config";
import useCurrentUser from "./useCurrentUser";
import queryKeys from "../../../constants/querykeys";
import { userData } from "../../../types/db";

export default function useCurrentUserDb() {
  const currentUser = useCurrentUser();
  const uid = currentUser?.uid!;

  return useQuery(
    [queryKeys.currentUser],
    async () => {
      const docRef = doc(firebaseDb, "users", uid);
      const res = await getDoc(docRef);
      const data = { id: res.id, ...res.data() };

      return data as userData;
    },
    {
      enabled: !!uid,
      staleTime: Infinity,
      onSuccess: () => {
        console.log("Gotten user");
      },
    }
  );
}
