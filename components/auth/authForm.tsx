import tw from "twin.macro";
import { FormEvent, MouseEventHandler, useCallback, useState } from "react";
import useForm from "../../hooks/custom/useForm";
import Typography from "../typography";
import { Call, CloseCircle, Message2 } from "iconsax-react";
import Link from "next/link";
import FormInput from "../FormInput";
import SubmitButton from "../buttons/SubmitButton";
import { useRouter } from "next/router";
import useSignUp from "../../hooks/mutations/auth/useSignUp";
import useLogin from "../../hooks/mutations/auth/useLogin";
import toast from "react-hot-toast";
import ActionButton from "../buttons/ActionButton";
import useSendResetPasswordMail from "../../hooks/mutations/auth/useSendResetEmail";
import { FirebaseError } from "firebase/app";
import handleError from "../../utils/handleError";

const initialState = {
  name: "",
  email: "",
  password: "",
};

type AuthFormProps = {
  onClose?: MouseEventHandler;
  disableClose?: boolean;
  isModal?: boolean;
  onSuccess?: VoidFunction;
  headingText?: string;
};

export default function AuthForm({
  isModal,
  disableClose,
  onSuccess,
  onClose,
  headingText,
}: AuthFormProps) {
  const router = useRouter();
  const { updateForm, formData } = useForm({
    initialState,
  });
  const signUp = useSignUp(
    formData.name,
    formData.email,
    formData.password,
    {}
  );

  const login = useLogin({
    email: formData.email,
    password: formData.password,
  });

  const isLoading = login.isLoading || signUp.isLoading;
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);

  const sendResetPasswordMailMutation = useSendResetPasswordMail();

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      if (forgotPassword) {
        sendResetPasswordMailMutation.mutate(formData.email, {
          onSuccess: () => {
            toast.success("Password reset email sent !");
            onSuccess && onSuccess();
          },
          onError: handleError,
        });
      } else if (isSigningUp) {
        // sign them up and route them back to the home page
        signUp.mutate(undefined, {
          onSuccess: () => {
            toast.success(`Welcome ${formData.name}!`);
            router.push("/");
            onSuccess && onSuccess();
          },
          onError: (e: any) => {
            toast.error(`An error occurred - ${e}`);
          },
        });
      } else {
        // log them in
        login.mutate(undefined, {
          onSuccess: () => {
            toast.success(`Welcome back!`);
            onSuccess && onSuccess();
          },
          onError: (error: any) => {
            let errorMessage = "An error occurred";

            switch (error.code) {
              case "auth/invalid-credential":
                errorMessage =
                  "Invalid credentials. Please check your email and password.";
                break;
              case "auth/user-not-found":
                errorMessage = "User not found. Please check your email.";
                break;
              case "auth/wrong-password":
                errorMessage = "Incorrect password. Please try again.";
                break;
              case "auth/too-many-requests":
                errorMessage = "Too many attempts. Please try again later.";
                break;
              case "auth/user-disabled":
                errorMessage =
                  "Your account has been disabled. Please contact support.";
                break;
              default:
                errorMessage = `An error occurred - ${error.message}`;
            }

            toast.error(errorMessage);
          },
        });
      }
    },
    [
      isSigningUp,
      formData.name,
      signUp,
      login,
      router,
      onSuccess,
      forgotPassword,
      sendResetPasswordMailMutation,
      formData.email,
    ]
  );

  const heading = forgotPassword
    ? "Recover Pasword"
    : isSigningUp
    ? "Sign Up"
    : "Welcome Back";

  return (
    <section tw=" flex flex-col px-12 py-12 overflow-hidden rounded-2xl lg:(flex-row)">
      <div tw="px-[4%] py-12 w-full ">
        <Typography.H4 tw="mb-5">{headingText ?? heading}</Typography.H4>
        {forgotPassword && (
          <Typography.P tw="mb-5">
            {"We will send new password to your email"}
          </Typography.P>
        )}

        <form onSubmit={onSubmit}>
          {isSigningUp && !forgotPassword && (
            <FormInput
              tw="mb-5 w-full text-gray-800 font-light"
              id="name"
              title="Name"
              type="name"
              placeholder=" your name"
              onChange={(e) => {
                updateForm("name", e.target.value);
              }}
              required
            />
          )}
          <FormInput
            tw="mb-5 text-gray-800 font-light"
            id="email"
            title="Email"
            type="email"
            placeholder=" your@email.com"
            onChange={(e) => {
              updateForm("email", e.target.value);
            }}
            required
          />

          <div tw="mb-5">
            {!forgotPassword && (
              <FormInput
                tw="mb-3 text-gray-800 font-light"
                id="password"
                title="password"
                type="password"
                placeholder=" password"
                onChange={(e) => {
                  updateForm("password", e.target.value);
                }}
                required
              />
            )}
            {!isSigningUp && !forgotPassword && (
              <ActionButton
                title={"Forgot password?"}
                tw="transition-all text-right  underline ml-auto text-gray-800 text-sm opacity-40"
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  padding: 0,
                  color: "#1A202E",
                }}
                onClick={() => setForgotPassword(true)}
              />
            )}
          </div>
          <SubmitButton
            type="submit"
            isLoading={isLoading}
            title={forgotPassword ? "Send me new password" : "sign in"}
          />
        </form>
        <div tw="mt-6 text-center">
          {isSigningUp ? (
            <Typography.P tw="text-sm">
              Have an account?{" "}
              <button
                onClick={() => setIsSigningUp(false)}
                tw="transition-all block text-sm w-[100%] underline opacity-50 hover:(opacity-100)"
                type="button"
              >
                Login
              </button>
            </Typography.P>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div
        tw="p-5 bg-[#fafafa] pr-[4%] "
        style={{
          display: "block",
        }}
      >
        <div tw=" pb-2  flex justify-end w-full ">
          {!disableClose && (
            <button tw=" hover:(scale-105)" onClick={onClose}>
              <CloseCircle />
            </button>
          )}
        </div>
        <Typography.H4 tw="pb-4">Contacts</Typography.H4>

        <Typography.P>If you have any questions, call or email us</Typography.P>

        <ul tw="mt-8">
          <li tw="transition-all hover:(opacity-50)">
            <Link href={"tel:0201231234"}>
              <span tw="flex gap-2 items-center mb-4">
                <Call />
                020 123 1234
              </span>
            </Link>
          </li>

          <li tw="transition-all hover:(opacity-50)">
            <Link href={"mailto:admin@nanosmoothies.com"}>
              <span tw="flex gap-2 items-center">
                <Message2 />
                admin@nanosmoothies.com
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
