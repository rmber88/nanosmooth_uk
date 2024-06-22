import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, updateDoc } from "firebase/firestore";
import { firebaseDb } from "../../../firebase/config";
import queryKeys from "../../../constants/querykeys";
import { orderDto } from "../../../types/db";

export default function useUpdateOrder() {
  const q = useQueryClient();
  return useMutation(
    async (data: { orderId: string; body: orderDto }) => {
      console.log("updating orders");

      const ref = doc(firebaseDb, "orders", data.orderId);
      const res = await updateDoc(ref, data.body);

      return res;
    },
    {
      onSuccess: (e) => q.invalidateQueries([queryKeys.orders]),
    }
  );
}
