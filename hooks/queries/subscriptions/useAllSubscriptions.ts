import { useQuery } from "@tanstack/react-query";
import queryKeys from "../../../constants/querykeys";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { firebaseDb } from "../../../firebase/config";
import { subscriptionData, userData } from "../../../types/db";

export default function useAllSubscriptions() {
  return useQuery([queryKeys.subscriptions, "all"], async () => {
    const subsRef = collection(firebaseDb, "subscriptions");

    const subsRes = await getDocs(subsRef);

    const promises = subsRes.docs.map((document) => {
      const subscriptionData = {
        id: document.id,
        ...document.data(),
      } as subscriptionData;

      return new Promise<userData & subscriptionData>(async (res, rej) => {
        try {
          const userRef = doc(firebaseDb, "users", document.id);
          const userRes = await getDoc(userRef);
          const userData = {
            ...userRes.data(),
          } as userData;

          res({
            ...userData,
            ...subscriptionData,
          });
        } catch (error) {
          rej(error);
        }
      });
    });

    const data = await Promise.all(promises);

    return data;
  });
}
