// Importing necessary libraries and hooks
import tw from "twin.macro"; // Library for using Tailwind CSS with styled-components
import { FormEvent, MouseEventHandler, useCallback, useState } from "react"; // React hooks and types
import useForm from "../../hooks/custom/useForm"; // Custom hook for form handling
import Typography from "../typography"; // Typography component for consistent text styles
import { Call, CloseCircle, Message2 } from "iconsax-react"; // Icon components
import Link from "next/link"; // Link component from Next.js for client-side navigation
import FormInput from "../FormInput"; // Custom input component
import SubmitButton from "../buttons/SubmitButton"; // Custom submit button
import { useRouter } from "next/router"; // Next.js hook for routing
import useSignUp from "../../hooks/mutations/auth/useSignUp"; // Custom hook for sign-up mutation
import useLogin from "../../hooks/mutations/auth/useLogin"; // Custom hook for login mutation
import toast from "react-hot-toast"; // Library for displaying notifications
import ActionButton from "../buttons/ActionButton"; // Custom action button
import useSendResetPasswordMail from "../../hooks/mutations/auth/useSendResetEmail"; // Custom hook for sending reset password email
import { FirebaseError } from "firebase/app"; // Firebase error handling
import handleError from "../../utils/handleError"; // Utility function for handling errors

// Initial state for the form
const initialState = {
  name: "",
  email: "",
  password: "",
};

// Type definition for the AuthForm props
type AuthFormProps = {
  onClose?: MouseEventHandler; // Optional mouse event handler for closing the form
  disableClose?: boolean; // Optional boolean to disable close functionality
  isModal?: boolean; // Optional boolean to indicate if the form is a modal
  onSuccess?: VoidFunction; // Optional callback function for successful form submission
  headingText?: string; // Optional custom heading text
};

// AuthForm component definition
export default function AuthForm({
  isModal,
  disableClose,
  onSuccess,
  onClose,
  headingText,
}: AuthFormProps) {
  const router = useRouter(); // Next.js router hook
  const { updateForm, formData } = useForm({ initialState }); // Custom form hook for handling form data
  const signUp = useSignUp(formData.name, formData.email, formData.password, {}); // Sign-up mutation hook

  const login = useLogin({
    email: formData.email,
    password: formData.password,
  }); // Login mutation hook

  const isLoading = login.isLoading || signUp.isLoading; // Boolean flag for loading state
  const [isSigningUp, setIsSigningUp] = useState(false); // State for toggling between sign-up and login
  const [forgotPassword, setForgotPassword] = useState(false); // State for toggling forgot password mode

  const sendResetPasswordMailMutation = useSendResetPasswordMail(); // Mutation hook for sending reset password email

  // Callback function for form submission
  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault(); // Prevent default form submission

      if (forgotPassword) {
        // Handle forgot password case
        sendResetPasswordMailMutation.mutate(formData.email, {
          onSuccess: () => {
            toast.success("Password reset email sent !"); // Display success message
            onSuccess && onSuccess(); // Call onSuccess callback if provided
          },
          onError: handleError, // Handle error using utility function
        });
      } else if (isSigningUp) {
        // Handle sign-up case
        signUp.mutate(undefined, {
          onSuccess: () => {
            toast.success(`Welcome ${formData.name}!`); // Display welcome message
            router.push("/"); // Redirect to home page
            onSuccess && onSuccess(); // Call onSuccess callback if provided
          },
          onError: (e: any) => {
            toast.error(`An error occurred - ${e}`); // Display error message
          },
        });
      } else {
        // Handle login case
        login.mutate(undefined, {
          onSuccess: () => {
            toast.success(`Welcome back!`); // Display welcome message
            onSuccess && onSuccess(); // Call onSuccess callback if provided
          },
          onError: (error: any) => {
            // Error handling for login
            let errorMessage = "An error occurred";

            switch (error.code) {
              case "auth/invalid-credential":
                errorMessage = "Invalid credentials. Please check your email and password.";
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
                errorMessage = "Your account has been disabled. Please contact support.";
                break;
              default:
                errorMessage = `An error occurred - ${error.message}`;
            }

            toast.error(errorMessage); // Display error message
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

  // Determine the heading text based on the current form state
  const heading = forgotPassword
    ? "Recover Pasword"
    : isSigningUp
    ? "Sign Up"
    : "Welcome Back";

  return (
    // Main container for the form
    <section tw="flex flex-col px-12 py-12 overflow-hidden rounded-2xl lg:(flex-row)">
      {/* Form container */}
      <div tw="px-[4%] py-12 w-full">
        <Typography.H4 tw="mb-5">{headingText ?? heading}</Typography.H4>
        {forgotPassword && (
          <Typography.P tw="mb-5">
            {"We will send new password to your email"}
          </Typography.P>
        )}

        {/* Form element */}
        <form onSubmit={onSubmit}>
          {isSigningUp && !forgotPassword && (
            // Name input for sign-up
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
          {/* Email input */}
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
              // Password input
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
              // Forgot password button
              <ActionButton
                title={"Forgot password?"}
                tw="transition-all text-right underline ml-auto text-gray-800 text-sm opacity-40"
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
          {/* Submit button */}
          <SubmitButton
            type="submit"
            isLoading={isLoading}
            title={forgotPassword ? "Send me new password" : "sign in"}
          />
        </form>
        <div tw="mt-6 text-center">
          {isSigningUp ? (
            // Toggle to login form
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

      {/* Contacts section */}
      <div
        tw="p-5 bg-[#fafafa] pr-[4%]"
        style={{
          display: "block",
        }}
      >
        <div tw="pb-2 flex justify-end w-full">
          {!disableClose && (
            // Close button
            <button tw="hover:(scale-105)" onClick={onClose}>
              <CloseCircle />
            </button>
          )}
        </div>
        <Typography.H4 tw="pb-4">Contacts</Typography.H4>

        <Typography.P>If you have any questions, call or email us</Typography.P>

        <ul tw="mt-8">
          <li tw="transition-all hover:(opacity-50)">
            {/* Phone contact */}
            <Link href={"tel:0201231234"}>
              <span tw="flex gap-2 items-center mb-4">
                <Call />
                020 123 1234
              </span>
            </Link>
          </li>

          <li tw="transition-all hover:(opacity-50)">
            {/* Email contact */}
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