// Import necessary hooks and utilities
import { FormEvent, useCallback, useEffect, useState } from "react";
import tw from "twin.macro";
import FormInput from "../FormInput";
import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "firebase/auth";
import useCurrentUser from "../../hooks/queries/auth/useCurrentUser";
import handleError from "../../utils/handleError";
import toast from "react-hot-toast";

// Define the type for the component props
type PasswordProps = {
  submitTrigger?: boolean;
  onSubmitSuccess?: () => void;
};

// Functional component to handle password update
export default function Password({
  submitTrigger,
  onSubmitSuccess,
}: PasswordProps) {
  const currentUser = useCurrentUser(); // Get the current user
  const [password, setPassword] = useState(""); // State for new password
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirming new password

  // Mutation to update the user's password
  const updateUserPassword = useMutation(async (data: { password: string }) => {
    const res = await updatePassword(currentUser!, data.password);
    return res;
  });

  // Function to clear the form inputs
  const clearForm = () => {
    setPassword("");
    setConfirmPassword("");
  };

  // Callback function for form submission
  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault(); // Prevent default form submission

      // Check if password meets requirements
      if (password.length < 6) {
        toast.error("Password should be at least 6 characters");
        clearForm();
        return;
      }

      // Check if passwords match
      if (password !== confirmPassword) {
        toast.error("Passwords should match");
        clearForm();
        return;
      }

      // Attempt to update password
      try {
        updateUserPassword.mutate(
          { password },
          {
            onError: handleError, // Handle error
            onSuccess: () => {
              toast.success("Password updated!");
              onSubmitSuccess?.(); // Call success callback if provided
            },
          }
        );
      } catch (e: any) {
        toast.error(`An error occurred - ${e.message}`);
      }
    },
    [password, confirmPassword, updateUserPassword, onSubmitSuccess]
  );

  // Effect to trigger form submission programmatically
  useEffect(() => {
    if (submitTrigger) {
      const form = document.getElementById("password-form");
      form?.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  }, [submitTrigger]);

  return (
    <form id="password-form" onSubmit={onSubmit} tw="mt-4">
      <FormInput
        tw="mb-4 w-[70%]"
        id="password"
        title="New Password"
        type="password"
        placeholder="Enter new password"
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <FormInput
        tw="mb-5 w-[70%]"
        id="confirm-password"
        title="Repeat New Password"
        type="password"
        placeholder="Re-enter new password"
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
    </form>
  );
}
