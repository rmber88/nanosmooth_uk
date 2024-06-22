import tw from "twin.macro";
import FormInput from "../../../FormInput";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useUserDetailsContext } from "../../../../context/UserDetailsContext";
import useCurrentUserDb from "../../../../hooks/queries/auth/useCurrentUserDb";

type Props = {
  formError?: {
    postcode?: string;
  };
};

export default function BillingDetails({ formError }: Props) {
  const { userDetailsFormState, setUserDetailsFormState } =
    useUserDetailsContext();
  const currentUserDb = useCurrentUserDb();

  useEffect(() => {
    if (!currentUserDb.data?.billingAddress) {
      return;
    }

    setUserDetailsFormState(currentUserDb.data.billingAddress);
  }, [currentUserDb.data?.billingAddress, setUserDetailsFormState]);

  return (
    <form tw="w-full flex flex-col gap-3">
      <FormInput
        id={userDetailsFormState.name ?? ""}
        type="text"
        title="Full Name"
        value={userDetailsFormState.name ?? ""}
        placeholder="Kostyantin Otchenashenko"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setUserDetailsFormState({
            ...userDetailsFormState,
            name: e.target.value,
          })
        }
      />

      <span tw="w-full flex items-center justify-between gap-3">
        <FormInput
          id={userDetailsFormState.street}
          type="text"
          title="Street address"
          value={userDetailsFormState.street}
          placeholder="Khrechatik 22"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setUserDetailsFormState({
              ...userDetailsFormState,
              street: e.target.value,
            })
          }
          tw="w-full"
        />
        <FormInput
          id={userDetailsFormState.apartment}
          type="text"
          title="Aptmnt, etc."
          value={userDetailsFormState.apartment}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setUserDetailsFormState({
              ...userDetailsFormState,
              apartment: e.target.value,
            })
          }
          // tw="w-[30%] ml-auto"
        />
      </span>

      <FormInput
        id={userDetailsFormState.town}
        type="text"
        title="Town / City"
        value={userDetailsFormState.town}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setUserDetailsFormState({
            ...userDetailsFormState,
            town: e.target.value,
          })
        }
      />

      <span tw="w-full flex items-center justify-between gap-3">
        <FormInput
          id={userDetailsFormState.country}
          type="text"
          title="Country"
          value={userDetailsFormState.country}
          placeholder="GB"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setUserDetailsFormState({
              ...userDetailsFormState,
              country: e.target.value,
            })
          }
        />
        <FormInput
          id={userDetailsFormState.postcode}
          type="text"
          title="Postcode"
          value={userDetailsFormState.postcode}
          error={formError?.postcode}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setUserDetailsFormState({
              ...userDetailsFormState,
              postcode: e.target.value,
            })
          }
        />
      </span>

      <FormInput
        id={userDetailsFormState.email}
        type="text"
        title="Email"
        value={userDetailsFormState.email}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setUserDetailsFormState({
            ...userDetailsFormState,
            email: e.target.value,
          })
        }
        tw="ml-auto"
      />
    </form>
  );
}
