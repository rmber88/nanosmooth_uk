import tw from "twin.macro";
import useUserSubscriptions from "../../hooks/queries/subscriptions/useUserSubscriptions";
import Typography from "../typography";
import { ButtonSpinner } from "../buttons/buttonSpinner";
import Link from "next/link";

interface SubscriptionProps {
  onSubmitSuccess?: () => void;
}

export default function Subscription({ onSubmitSuccess }: SubscriptionProps) {
  const subscription = useUserSubscriptions();

  const isLoading = subscription.isLoading;

  const details = [
    {
      title: "Status",
      value: subscription.data?.isActive ? "Active" : "Inactive",
    },
    {
      title: "You get",
      value: subscription.data?.quantity
        ? `${subscription.data?.quantity / 14}(${
            subscription.data?.quantity
          } sachets) per month`
        : "",
    },
    { title: "Price", value: `£${subscription.data?.totalPrice}` },
    {
      title: "Started on",
      value: new Date(subscription.data?.startDate ?? "").toDateString(),
    },
    {
      title: "Renews on",
      value: new Date(subscription.data?.endDate ?? "").toDateString(),
    },
  ];

  return (
    <section tw="pb-8 mt-4">
      <span>{isLoading && ButtonSpinner}</span>

      {/* When subscribed */}
      {subscription.data && (
        <ul tw="flex flex-col gap-2">
          {details.map((detail) => {
            return (
              <li tw="flex justify-between " key={detail.title}>
                <Typography.P isGrey>{detail.title}</Typography.P>
                <Typography.P tw="font-normal">{detail.value}</Typography.P>
              </li>
            );
          })}
        </ul>
      )}

      {/* When unsubscribed */}
      {!subscription.data && (
        <div>
          <Typography.P tw="mb-4" isGrey>
            You haven&apos;t subscribed to nanosmmothies yet...
          </Typography.P>
          <Link
            href={"/"}
            tw="rounded-xl px-4 py-2 border shadow transition-all hover:(bg-gray-50)"
          >
            Subscribe
          </Link>
        </div>
      )}
    </section>
  );
}
