/* eslint-disable react/no-unknown-property */
import tw from "twin.macro";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import FormInput from "../../../FormInput";
import { useUserDetailsContext } from "../../../../context/UserDetailsContext";
import useCurrentUserDb from "../../../../hooks/queries/auth/useCurrentUserDb";

type Props = {
  shippingDetails: any;
  setShippingDetails: Dispatch<SetStateAction<any>>;
  formError?: {
    postcode?: string;
  };
};

export default function ShippingDetails({
  setShippingDetails,
  shippingDetails,
  formError,
}: Props) {
  const { userDetailsFormState, isChecked, toggleChecked } =
    useUserDetailsContext();

  const currentUserDb = useCurrentUserDb();

  useEffect(() => {
    if (!currentUserDb.data?.shippingAddress) {
      return;
    }

    setShippingDetails(currentUserDb.data?.shippingAddress);
  }, [currentUserDb.data?.shippingAddress, setShippingDetails]);

  useEffect(() => {
    if (isChecked) {
      setShippingDetails(userDetailsFormState);
    }
  }, [isChecked, userDetailsFormState, setShippingDetails]);

  return (
    <form action="" tw="w-full flex flex-col gap-3">
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

      <span tw="w-full flex items-center justify-between gap-3">
        <FormInput
          id="street"
          type="text"
          title="Street address"
          value={shippingDetails?.street}
          placeholder="Khrechatik 22"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setShippingDetails({
              ...shippingDetails,
              street: e.target.value,
            })
          }
          tw="w-full"
        />
        <FormInput
          id="apartment"
          type="text"
          title="Aptmnt, etc."
          value={shippingDetails?.apartment}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setShippingDetails({
              ...shippingDetails,
              apartment: e.target.value,
            })
          }
          // tw="w-[30%] ml-auto"
        />
      </span>

      <FormInput
        id="town"
        type="text"
        title="Town / City"
        value={shippingDetails?.town}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setShippingDetails({ ...shippingDetails, town: e.target.value })
        }
      />

      <span tw="w-full flex items-center justify-between gap-3">
        <FormInput
          id="country"
          type="text"
          title="Country"
          value={shippingDetails?.country}
          placeholder="GB"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setShippingDetails({ ...shippingDetails, country: e.target.value })
          }
        />
        <FormInput
          id="postcode"
          type="text"
          title="Postcode"
          value={shippingDetails?.postcode}
          error={formError?.postcode}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setShippingDetails({ ...shippingDetails, postcode: e.target.value })
          }
        />
      </span>

      <FormInput
        id="email"
        type="text"
        title="Email"
        value={shippingDetails?.email}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setShippingDetails({ ...shippingDetails, email: e.target.value })
        }
        tw="ml-auto"
      />
    </form>
  );
}
