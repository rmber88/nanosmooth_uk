// Import necessary hooks and libraries from React and other dependencies
import { FormEvent, useCallback, useEffect, useState } from "react";
import tw from "twin.macro"; // Import Twin.macro for styled components
import FormInput from "../FormInput"; // Import custom FormInput component

// Import necessary functions and hooks from Firebase and other utility libraries
import { useMutation } from "@tanstack/react-query";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
} from "firebase/auth";
import useCurrentUser from "../../hooks/queries/auth/useCurrentUser";
import handleError from "../../utils/handleError";
import toast from "react-hot-toast";
import { useUpdateUserDb } from "../../hooks/mutations/auth/useUpdateUserDb";

// Define the type for the component props
type EmailProps = {
  submitTrigger?: boolean;
  onSubmitSuccess?: () => void;
};

// Function to reauthenticate the user with their current password
export async function reauthenticate(currentUser: any, password: string) {
  const credential = EmailAuthProvider.credential(currentUser.email, password);
  await reauthenticateWithCredential(currentUser, credential); // Reauthenticate the user
}

// Main component function for updating the user's email
export default function Email({ submitTrigger, onSubmitSuccess }: EmailProps) {
  const currentUser = useCurrentUser(); // Hook to get the current user
  const [email, setEmail] = useState(""); // State to store the new email input

  const updateUserDb = useUpdateUserDb(); // Hook to update user data in the database

  // Mutation to update the user's email
  const updateUserEmail = useMutation(
    async (data: { email: string }) => {
      if (!currentUser) {
        throw new Error("User not authenticated"); // Throw error if user is not authenticated
      }
      const res = await updateEmail(currentUser, data.email); // Update email in Firebase
      return res;
    },
    {
      onError: async (error: any) => {
        if (error.code === "auth/requires-recent-login") {
          try {
            toast.error(
              "Please logout and sign in again to update your email."
            ); // Show error message if reauthentication is required
          } catch (reauthError) {
            handleError(reauthError);
            toast.error("Reauthentication failed. Please try again."); // Handle reauthentication error
          }
        } else {
          handleError(error); // Handle other errors
        }
      },
    }
  );

  // Effect to handle form submission when submitTrigger changes
  useEffect(() => {
    if (submitTrigger) {
      const form = document.getElementById("email-form");
      form?.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true }) // Programmatically submit the form
      );
    }
  }, [submitTrigger]);

  // Callback function to handle form submission
  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault(); // Prevent default form submission behavior

      if (!email) {
        toast.error("Please enter a valid email address"); // Show error if email input is empty
        return;
      }
      updateUserEmail.mutate(
        { email },
        {
          onError: handleError, // Handle error on email update
          onSuccess: () => {
            updateUserDb.mutate(
              { email },
              {
                onError: handleError, // Handle error on database update
                onSuccess: () => {
                  toast.success("Email updated!"); // Show success message
                  onSubmitSuccess?.(); // Call success callback if provided
                },
              }
            );
          },
        }
      );
    },
    [email, updateUserDb, updateUserEmail, onSubmitSuccess]
  );

  // Boolean to indicate if loading is in progress
  const isLoading = updateUserDb.isLoading || updateUserEmail.isLoading;

  return (
    <form id="email-form" onSubmit={onSubmit}>
      <FormInput
        tw=" mb-5 mt-8 w-[70%]" // Style the form input using Twin.macro
        id="email"
        title="New Email"
        type="email"
        placeholder={currentUser?.email ?? "Enter your new email"} // Placeholder with current email or default text
        onChange={(e) => setEmail(e.target.value)} // Update email state on input change
        required
      />
    </form>
  );
}
