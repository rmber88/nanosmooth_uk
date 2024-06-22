import { FormEvent, useCallback, useEffect, useState } from "react";
import tw from "twin.macro";
import FormInput from "../FormInput";
import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "firebase/auth";
import useCurrentUser from "../../hooks/queries/auth/useCurrentUser";
import handleError from "../../utils/handleError";
import toast from "react-hot-toast";

type PasswordProps = {
  submitTrigger?: boolean;
  onSubmitSuccess?: () => void;
};

export default function Password({
  submitTrigger,
  onSubmitSuccess,
}: PasswordProps) {
  const currentUser = useCurrentUser();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updateUserPassword = useMutation(async (data: { password: string }) => {
    const res = await updatePassword(currentUser!, data.password);
    return res;
  });

    const clearForm = () => {
      setPassword("");
      setConfirmPassword("");
    };

    const onSubmit = useCallback(
      (e: FormEvent) => {
        e.preventDefault();

        if (password.length < 6) {
          toast.error("Password should be at least 6 characters");
          clearForm();
          return;
        }

        if (password !== confirmPassword) {
          toast.error("Passwords should match");
          clearForm();
          return;
        }

        try {
          updateUserPassword.mutate(
            { password },
            {
              onError: handleError,
              onSuccess: () => {
                toast.success("Password updated!");
                onSubmitSuccess?.();
              },
            }
          );
        } catch (e: any) {
          // clearForm();/
          toast.error(`An error occurred - ${e}`);
        }
      },
      [password, confirmPassword, updateUserPassword, onSubmitSuccess]
    );
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
        placeholder={"Enter new password"}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        required
      />
      <FormInput
        tw="mb-5 w-[70%]"
        id="confirm-password"
        title="Repeat New Password"
        type="password"
        placeholder={"Re-enter new password"}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
        }}
        required
      />
    </form>
  );
}
