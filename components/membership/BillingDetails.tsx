import tw from "twin.macro";
import FormInput from "../FormInput";
import useCurrentUserDb from "../../hooks/queries/auth/useCurrentUserDb";
import { FormEvent, useCallback, useEffect } from "react";
import useForm from "../../hooks/custom/useForm";
import SubmitButton from "../buttons/SubmitButton";
import handleError from "../../utils/handleError";
import toast from "react-hot-toast";
import { useUpdateUserDb } from "../../hooks/mutations/auth/useUpdateUserDb";

const initialState = {
  name: "",
  street: "",
  apartment: "",
  town: "",
  country: "",
  postcode: "",
  email: "",
};

type BillingDetailsProps = {
  submitTrigger?: boolean;
  onSubmitSuccess?: () => void;
};

export default function BillingDetails({
  submitTrigger,
  onSubmitSuccess,
}: BillingDetailsProps) {
  const currentUserDb = useCurrentUserDb();
  const updateUserDb = useUpdateUserDb();

  const billingInfo = currentUserDb.data?.billingAddress;
  const { formData, updateForm } = useForm({ initialState });

  const noChangesYet = Object.values(formData).every((value) => {
    return value.toString().length === 0;
  });

  useEffect(() => {
    if (submitTrigger) {
      const form = document.getElementById("billing-form");
      form?.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  }, [submitTrigger]);

const onSubmit = useCallback(
  (e: FormEvent) => {
    e.preventDefault();

    if (noChangesYet) {
      return;
    }

    updateUserDb.mutate(
      { billingAddress: { ...billingInfo, ...formData } },
      {
        onError: handleError,
        onSuccess: () => {
          currentUserDb.refetch();
          toast.success("Billing address updated!");
          onSubmitSuccess?.();
        },
      }
    );
  },
  [
    // noChangesYet,
    billingInfo,
    formData,
    updateUserDb,
    currentUserDb,
    onSubmitSuccess,
  ]
);

  return (
    <form
      id="billing-form"
      onSubmit={onSubmit}
      tw="w-full flex flex-col gap-3 mb-8 mt-8 "
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
