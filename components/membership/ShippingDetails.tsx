import tw from "twin.macro";
import FormInput from "../FormInput";
import useCurrentUserDb from "../../hooks/queries/auth/useCurrentUserDb";
import { FormEvent, useCallback, useEffect, useState } from "react";

import useForm from "../../hooks/custom/useForm";
import SubmitButton from "../buttons/SubmitButton";
import handleError from "../../utils/handleError";
import toast from "react-hot-toast";
import { useUpdateUserDb } from "../../hooks/mutations/auth/useUpdateUserDb";
import { useUserDetailsContext } from "../../context/UserDetailsContext";

const initialState = {
  name: "",
  street: "",
  apartment: "",
  town: "",
  country: "",
  postcode: "",
  email: "",
};

type ShippingDetailsProps = {
  submitTrigger?: boolean;
  onSubmitSuccess?: () => void;
};

export default function ShippingDetails({
  submitTrigger,
  onSubmitSuccess,
}: ShippingDetailsProps) {
  const currentUserDb = useCurrentUserDb();
  const updateUserDb = useUpdateUserDb();

  const shippingInfo = currentUserDb.data?.shippingAddress;
  const { formData, updateForm } = useForm({ initialState });
  const [shippingDetails, setShippingDetails] = useState<any>();

  const { userDetailsFormState, isChecked, toggleChecked } =
    useUserDetailsContext();

  const noChangesYet = Object.values(formData)?.every((value) => {
    return value.toString()?.length === 0;
  });

  useEffect(() => {
    if (submitTrigger) {
      const form = document.getElementById("shipping-form");
      form?.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  }, [submitTrigger]);

  useEffect(() => {
    if (isChecked) {
      setShippingDetails(userDetailsFormState);
    }
  }, [isChecked, userDetailsFormState, setShippingDetails]);

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      if (noChangesYet) {
        return;
      }

      updateUserDb.mutate(
        { billingAddress: { ...shippingInfo, ...formData } },
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
      shippingInfo,
      formData,
      updateUserDb,
      currentUserDb,
      onSubmitSuccess,
    ]
  );

  return (
    <form
      id="shipping-form"
      onSubmit={onSubmit}
      tw="w-full flex flex-col gap-3 mb-8 mt-8"
    >
      <div tw="flex items-center">
        <span
          tw="relative w-[3.6rem] h-[2rem] rounded-3xl "
          style={{
            backgroundColor: isChecked ? "#5C71A3" : "lightgray",
          }}
        >
          <input
            type="checkbox"
            checked={isChecked}
            onChange={toggleChecked}
            tw="appearance-none absolute top-0 left-0 h-[100%] w-full cursor-pointer"
          />

          <div
            tw="h-[90%] w-[48%] rounded-full  absolute top-[0.097em] left-0 transition-all duration-200 cursor-pointer"
            style={{
              transform: isChecked ? "translateX(98%)" : "translateX(6%)",
              backgroundColor: isChecked ? "white" : "#5C71A3",
            }}
            onClick={toggleChecked}
          />
        </span>
        {isChecked && <span tw="text-sm ml-2">Same as billing</span>}
      </div>

      <FormInput
        id="name"
        type="text"
        title="Full Name"
        placeholder={
          (isChecked ? userDetailsFormState : shippingInfo)?.name ?? "Full name"
        }
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
          placeholder={
            (isChecked ? userDetailsFormState : shippingInfo)?.street ??
            "Street"
          }
          onChange={(e) => updateForm("street", e.target.value)}
        />

        <FormInput
          id="apartment"
          type="text"
          title="Aptmnt, etc."
          placeholder={
            (isChecked ? userDetailsFormState : shippingInfo)?.apartment ??
            "Apt"
          }
          onChange={(e) => updateForm("apartment", e.target.value)}
        />
      </span>

      <FormInput
        id="town"
        type="text"
        title="Town / City"
        placeholder={
          (isChecked ? userDetailsFormState : shippingInfo)?.town ?? "Town"
        }
        onChange={(e) => updateForm("town", e.target.value)}
        required
      />

      <span tw="w-full flex items-center justify-between gap-3">
        <FormInput
          id="country"
          type="text"
          title="Country"
          required
          placeholder={
            (isChecked ? userDetailsFormState : shippingInfo)?.country ??
            "Country"
          }
          onChange={(e) => updateForm("country", e.target.value)}
        />
        <FormInput
          id="postcode"
          type="text"
          title="Postcode"
          required
          placeholder={
            (isChecked ? userDetailsFormState : shippingInfo)?.postcode ??
            "Postcode"
          }
          onChange={(e) => updateForm("postcode", e.target.value)}
        />
      </span>

      <FormInput
        id="email"
        type="text"
        title="Email"
        tw="ml-auto"
        required
        placeholder={
          (isChecked ? userDetailsFormState : shippingInfo)?.email ?? "Email"
        }
        onChange={(e) => updateForm("email", e.target.value)}
      />
    </form>
  );
}
