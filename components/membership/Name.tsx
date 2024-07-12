// Import necessary hooks and components from React and other dependencies
import { FormEvent, useCallback, useState } from "react";
import tw from "twin.macro"; // Import Twin.macro for styled components
import FormInput from "../FormInput"; // Import custom FormInput component
import SubmitButton from "../buttons/SubmitButton"; // Import custom SubmitButton component

// Import necessary functions and hooks from Firebase and other utility libraries
import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "firebase/auth";
import useCurrentUser from "../../hooks/queries/auth/useCurrentUser"; // Custom hook to get current user
import handleError from "../../utils/handleError"; // Utility function to handle errors
import toast from "react-hot-toast"; // Library for toast notifications
import { useUpdateUserDb } from "../../hooks/mutations/auth/useUpdateUserDb"; // Custom hook to update user data in the database

// Component function for updating the user's name
export default function Name() {
  const currentUser = useCurrentUser(); // Hook to get the current user
  const [name, setName] = useState(""); // State to store the new name input

  const updateUserDb = useUpdateUserDb(); // Hook to update user data in the database

  // Mutation to update the user's name in Firebase Auth
  const updateUserName = useMutation(async (data: { name: string }) => {
    const res = await updateProfile(currentUser!, {
      displayName: data.name,
    });
    return res;
  });

  // Callback function to handle form submission
  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault(); // Prevent default form submission behavior

      // Update the name in Firebase Auth and then update it in the database
      updateUserName.mutate(
        { name },
        {
          onError: handleError, // Handle error on name update
          onSuccess: () => {
            updateUserDb.mutate(
              { name },
              {
                onError: handleError, // Handle error on database update
                onSuccess: () => {
                  toast.success("Name updated!"); // Show success message
                },
              }
            );
          },
        }
      );
    },
    [name, updateUserDb, updateUserName] // Dependencies for the callback
  );

  // Boolean to indicate if loading is in progress
  const isLoading = updateUserDb.isLoading || updateUserName.isLoading;

  // Boolean to check if there are no changes yet
  const noChangesYet = name.length === 0;

  return (
    <form onSubmit={onSubmit}>
      <FormInput
        tw="mb-5" // Apply margin styles using Twin.macro
        id="name"
        title="Name"
        type="text"
        placeholder={currentUser?.displayName ?? ""} // Placeholder with current name or empty string
        onChange={(e) => {
          setName(e.target.value); // Update name state on input change
        }}
        required
      />

      <SubmitButton
        type="submit"
        isLoading={isLoading} // Disable button and show loading state if loading
        title="Save Changes"
        disabled={noChangesYet} // Disable button if no changes yet
      />
    </form>
  );
}
