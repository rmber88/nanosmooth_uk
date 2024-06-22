import { FormEvent, useCallback } from "react";
import tw from "twin.macro";
import Typography from "../typography";
import useUserSubscriptions from "../../hooks/queries/subscriptions/useUserSubscriptions";

import { useUpdateUserDb } from "../../hooks/mutations/auth/useUpdateUserDb";

interface BillingDateProps {
  onSubmitSuccess?: () => void;
}

export default function BillingDate({ onSubmitSuccess }: BillingDateProps) {
  const updateUserDb = useUpdateUserDb();
  const subscription = useUserSubscriptions();

  const onSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
  }, []);

  const startDate = new Date(subscription.data?.startDate ?? Date.now());
  startDate.setDate(startDate.getDate() + 30);

  const paymentDate = startDate;

  const deliveryDate = new Date(subscription.data?.startDate ?? Date.now());
  deliveryDate.setDate(deliveryDate.getDate() + 2);

  const estDate = deliveryDate;

  return (
    <form onSubmit={onSubmit}>
      <section tw={" flex flex-row py-8 place-content-between"}>
        <div tw={" flex flex-col "}>
          <Typography.P tw="px-4 font-thin text-gray-800 pb-4">
            {"Billing day"}
          </Typography.P>
          <div tw={" flex flex-row "}>
            <Typography.P tw="px-4 font-light">
              {paymentDate.toDateString()}
            </Typography.P>
            <Typography.P tw="px-4 font-light">{"of each month"}</Typography.P>
          </div>
        </div>
        <div tw={" flex flex-col"}>
          <Typography.P tw="px-4 font-thin text-gray-800 pb-4">
            {"Delivery day"}
          </Typography.P>
          <div tw={" flex flex-row "}>
            <Typography.P tw="px-4 font-light">
              {estDate.toDateString()}
            </Typography.P>
            <Typography.P tw="px-4 font-light">{"of this month"}</Typography.P>
          </div>
        </div>
      </section>
    </form>
  );
}
