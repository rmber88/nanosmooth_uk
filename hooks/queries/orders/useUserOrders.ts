import { useQuery } from "@tanstack/react-query";
import queryKeys from "../../../constants/querykeys";
import useCurrentUser from "../auth/useCurrentUser";
import {
  QueryConstraint,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firebaseDb } from "../../../firebase/config";
import { orderData } from "../../../types/db";

export default function useUserOrders(
  userId?: string,
  params?: QueryConstraint[]
) {
  const currentUser = useCurrentUser();
  const id = userId ?? currentUser?.uid;

  return useQuery(
    [queryKeys.orders, id, { params }],
    async () => {
      const ref = collection(firebaseDb, "orders");
      const queries = [where("userId", "==", id), ...(params ?? [])];
      const q = query(ref, ...queries);

      const res = await getDocs(q);
      return res.docs.map((d) => {
        return { id: d.id, ...d.data() } as orderData;
      });
    },
    {
      enabled: !!id,
      onError: (e) => {
        console.log({ e });
      },
    }
  );
}
