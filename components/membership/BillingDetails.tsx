import tw from "twin.macro";
import FormInput from "../FormInput";
import useCurrentUserDb from "../../hooks/queries/auth/useCurrentUserDb";
import { FormEvent, useCallback, useEffect } from "react";
import useForm from "../../hooks/custom/useForm";
import SubmitButton from "../buttons/SubmitButton";
import handleError from "../../utils/handleError";
import toast from "react-hot-toast";
import { useUpdateUserDb } from "../../hooks/mutations/auth/useUpdateUserDb";

// Initial state for the form data.
const initialState = {
  name: "",
  street: "",
  apartment: "",
  town: "",
  country: "",
  postcode: "",
  email: "",
};

// Define the type for the props of the BillingDetails component.
// It includes an optional submitTrigger to trigger form submission and an onSubmitSuccess callback.
type BillingDetailsProps = {
  submitTrigger?: boolean;
  onSubmitSuccess?: () => void;
};

// Define the BillingDetails component which accepts BillingDetailsProps.
export default function BillingDetails({
  submitTrigger,
  onSubmitSuccess,
}: BillingDetailsProps) {
  // Custom hook to fetch the current user data from the database.
  const currentUserDb = useCurrentUserDb();

  // Custom hook to handle updating user data in the database.
  const updateUserDb = useUpdateUserDb();

  // Extract the billing address information from the current user data.
  const billingInfo = currentUserDb.data?.billingAddress;

  // Custom hook to manage form state with initial state.
  const { formData, updateForm } = useForm({ initialState });

  // Check if no changes have been made to the form.
  const noChangesYet = Object.values(formData).every((value) => {
    return value.toString().length === 0;
  });

  // useEffect hook to trigger form submission when submitTrigger changes.
  useEffect(() => {
    if (submitTrigger) {
      const form = document.getElementById("billing-form");
      form?.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  }, [submitTrigger]);

  // useCallback hook to memoize the onSubmit function.
  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      // Return early if no changes have been made to the form.
      if (noChangesYet) {
        return;
      }

      // Update user data in the database with the new billing address.
      updateUserDb.mutate(
        { billingAddress: { ...billingInfo, ...formData } },
        {
          onError: handleError,
          onSuccess: () => {
            // Refetch the current user data and show a success toast notification.
            currentUserDb.refetch();
            toast.success("Billing address updated!");
            // Call the onSubmitSuccess callback if provided.
            onSubmitSuccess?.();
          },
        }
      );
    },
    [
      noChangesYet,
      billingInfo,
      formData,
      updateUserDb,
      currentUserDb,
      onSubmitSuccess,
    ]
  );

  return (
    // Form element with onSubmit handler.
    <form
      id="billing-form"
      onSubmit={onSubmit}
      tw="w-full flex flex-col gap-3 mb-8 mt-8"
    >
      <FormInput
        id="name"
        type="text"
        title="Full Name"
        placeholder={billingInfo?.name ?? "Full name"}
        onChange={(e) => updateForm("name", e.target.value)}
        required
      />

      <span tw="w-full flex items-center justify-between gap-3">
        <FormInput
          id="street"
          type="text"
          title="Street address"
          tw="w-full"
          required
          placeholder={billingInfo?.street ?? "Street"}
          onChange={(e) => updateForm("street", e.target.value)}
        />

        <FormInput
          id="apartment"
          type="text"
          title="Aptmnt, etc."
          placeholder={billingInfo?.apartment ?? "Apt"}
          onChange={(e) => updateForm("apartment", e.target.value)}
        />
      </span>

      <FormInput
        id="town"
        type="text"
        title="Town / City"
        placeholder={billingInfo?.town ?? "Town"}
        onChange={(e) => updateForm("town", e.target.value)}
        required
      />

      <span tw="w-full flex items-center justify-between gap-3">
        <FormInput
          id="country"
          type="text"
          title="Country"
          required
          placeholder={billingInfo?.country ?? "Country"}
          onChange={(e) => updateForm("country", e.target.value)}
        />
        <FormInput
          id="postcode"
          type="text"
          title="Postcode"
          required
          placeholder={billingInfo?.postcode ?? "Postcode"}
          onChange={(e) => updateForm("postcode", e.target.value)}
        />
      </span>

      <FormInput
        id="email"
        type="text"
        title="Email"
        tw="ml-auto"
        required
        placeholder={billingInfo?.email ?? "Email"}
        onChange={(e) => updateForm("email", e.target.value)}
      />
    </form>
  );
}
