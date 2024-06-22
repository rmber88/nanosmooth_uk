



import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDoc, collection } from "firebase/firestore";
import { firebaseDb } from "../../../firebase/config";
import queryKeys  from "../../../constants/querykeys";
import { orderDto } from "../../../types/db";

export default function useCreateOrder() {
  const q = useQueryClient();
  return useMutation(
    async (data: orderDto) => {
      const ref = collection(firebaseDb, "orders");
      const res = await addDoc(ref, data);

      return res;
    },
    {
      onSuccess: () => q.invalidateQueries([queryKeys.orders]),
    }
  );
}
