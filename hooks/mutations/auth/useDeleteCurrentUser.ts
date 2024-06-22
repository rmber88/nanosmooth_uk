import { getAuth } from "firebase/auth";
import { firebaseApp, firebaseDb } from "../../../firebase/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import queryKeys from "../../../constants/querykeys";
import useCurrentUserDb from "../../queries/auth/useCurrentUserDb";
import useUserSubscriptions from "../../queries/subscriptions/useUserSubscriptions";
import useCurrentUser from "../../queries/auth/useCurrentUser";
import { deleteDoc, doc, setDoc } from "firebase/firestore";

export default function useDeleteCurrentUser() {
  const q = useQueryClient();
  const auth = getAuth(firebaseApp);

  const userDb = useCurrentUserDb();
  const userSubscription = useUserSubscriptions();
  const currentUser = useCurrentUser();
  const uid = currentUser?.uid!;

  return useMutation(
    async () => {
      // save details in firebase failed registrations
      const failedRegRef = doc(firebaseDb, "failed_registrations", uid);
      const saveToFailed = await setDoc(failedRegRef, {
        user: userDb.data,
        subscription: userSubscription.data,
      });

      // delete subscription
      const userSubref = doc(firebaseDb, "subscriptions", uid);
      const deleteSub = await deleteDoc(userSubref);

      // delete user document
      const userDocRef = doc(firebaseDb, "users", uid);
      const deleteUserDoc = await deleteDoc(userDocRef);

      // delete user
      const deleteUser = await auth.currentUser?.delete();

      const res = { saveToFailed, deleteSub, deleteUserDoc, deleteUser };
      return res;
    },
    {
      onSuccess: () => {
        q.invalidateQueries([queryKeys.currentUser]);
      },
    }
  );
}
