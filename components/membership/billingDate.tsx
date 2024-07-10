import { FormEvent, useCallback } from "react";
import tw from "twin.macro";
import Typography from "../typography";
import useUserSubscriptions from "../../hooks/queries/subscriptions/useUserSubscriptions";
import { useUpdateUserDb } from "../../hooks/mutations/auth/useUpdateUserDb";

// Define the props for the BillingDate component.
// onSubmitSuccess is an optional callback function to be called upon successful submission.
interface BillingDateProps {
  onSubmitSuccess?: () => void;
}

// Define the BillingDate component which accepts BillingDateProps.
export default function BillingDate({ onSubmitSuccess }: BillingDateProps) {
  // Custom hook to handle updating user in the database.
  const updateUserDb = useUpdateUserDb();

  // Custom hook to fetch user subscriptions.
  const subscription = useUserSubscriptions();

  // useCallback hook to memoize the onSubmit function.
  const onSubmit = useCallback((e: FormEvent) => {
    // Prevent the default form submission behavior.
    e.preventDefault();
  }, []);

  // Calculate the payment date, which is 30 days after the subscription start date.
  const startDate = new Date(subscription.data?.startDate ?? Date.now());
  startDate.setDate(startDate.getDate() + 30);
  const paymentDate = startDate;

  // Calculate the delivery date, which is 2 days after the subscription start date.
  const deliveryDate = new Date(subscription.data?.startDate ?? Date.now());
  deliveryDate.setDate(deliveryDate.getDate() + 2);
  const estDate = deliveryDate;

  return (
    // Form element with onSubmit handler.
    <form onSubmit={onSubmit}>
      <section tw={"flex flex-row py-8 place-content-between"}>
        {/* Billing Date Section */}
        <div tw={"flex flex-col"}>
          <Typography.P tw="px-4 font-thin text-gray-800 pb-4">
            {"Billing day"}
          </Typography.P>
          <div tw={"flex flex-row"}>
            <Typography.P tw="px-4 font-light">
              {paymentDate.toDateString()}
            </Typography.P>
            <Typography.P tw="px-4 font-light">{"of each month"}</Typography.P>
          </div>
        </div>

        {/* Delivery Date Section */}
        <div tw={"flex flex-col"}>
          <Typography.P tw="px-4 font-thin text-gray-800 pb-4">
            {"Delivery day"}
          </Typography.P>
          <div tw={"flex flex-row"}>
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
