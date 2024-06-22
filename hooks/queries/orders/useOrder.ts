import { useQuery } from "@tanstack/react-query";
import { collection, doc, getDoc } from "firebase/firestore";
import { firebaseDb } from "../../../firebase/config";
import { orderData } from "../../../types/db";
import queryKeys from "../../../constants/querykeys";

export default function useOrder(id?: string) {
  return useQuery(
    [queryKeys.orders, id],

    async () => {
      if (!id) {
        return;
      }

      console.log("fetching orderid - " + id);
      const ref = doc(firebaseDb, "orders", id!);

      const res = await getDoc(ref);

      return res.data() as orderData;
    },
    {
      enabled: !!id,
    }
  );
}
