import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { firebaseApp, firebaseDb } from "../../../firebase/config";
import { useMutation } from "@tanstack/react-query";
import { setDoc, doc } from "firebase/firestore";
import { userDto } from "../../../types/db";

type dbData = Omit<userDto, "id" | "name" | "email">;

//** Creating a user in firebase */
async function SetUser(data: userDto) {
  const queryResponse = await setDoc(
    doc(firebaseDb, "users", data?.id!),
    {
      ...data,
    },
    {
      merge: true,
    }
  );
  return queryResponse;
}

export default function useSignUp(
  name: string,
  email: string,
  password: string,
  dbData: dbData
) {
  const auth = getAuth(firebaseApp);

  //** Wrapping CreateUser in react query */
  return useMutation(
    async () => {
      //** Creating user in auth */
      await createUserWithEmailAndPassword(auth, email, password).then(
        (user) => {
          //** Setting user in DB */
          return SetUser({
            id: user.user.uid,
            email: user.user.email!,
            ...dbData,
          })
            .then(() => {
              //** Update their display name with updateProfile */
              return updateProfile(auth.currentUser!, { displayName: name });
            })
            .then(() => {
              if (auth.currentUser) {
                //** Send verification email */
                sendEmailVerification(auth.currentUser, {
                  url: `${window.location.origin}`,
                });
              }
            });
        }
      );
    },
    {
      onSuccess: () => {
        //  Do any extra stuff
      },
    }
  );
}
