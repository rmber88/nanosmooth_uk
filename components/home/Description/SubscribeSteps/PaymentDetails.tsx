import tw from "twin.macro";
import { useContext, useEffect } from "react";
import { PurchaseContext } from "../../../../context/PurchaseContext";
import Typography from "../../../typography";
import { ArrowLeft } from "iconsax-react";

import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import useInitCheckout from "../../../../hooks/mutations/orders/useInitCheckout";
import useCurrentUser from "../../../../hooks/queries/auth/useCurrentUser";
import useUserSubscriptions from "../../../../hooks/queries/subscriptions/useUserSubscriptions";
import useCreateSubscription from "../../../../hooks/mutations/subscriptions/useCreateSubscription";
import toast from "react-hot-toast";
import getThirtyDaysFromToday from "../../../../utils/getThirtyDaysFromToday";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK!);

type Props = {
  step: number;
  setStep: (step: number) => void;
};

export default function PaymentDetails({ step, setStep }: Props) {
  const { totalPrice, totalSachets } = useContext(PurchaseContext);
  const createSubscription = useCreateSubscription();
  const currentUser = useCurrentUser();

  useEffect(() => {
    if (!currentUser?.uid) return;
    createSubscription.mutate(
      {
        isActive: false,
        endDate: getThirtyDaysFromToday().toISOString(),
        quantity: totalSachets,
        startDate: new Date().toISOString(),
        totalPrice: totalPrice,
        userId: currentUser?.uid,
      },
      {
        onSuccess: () => {
          toast.success("Subscription created");
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.uid, totalPrice, totalSachets]);

  const { fetchClientSecret } = useInitCheckout(
    {
      customerEmail: currentUser?.email!,
      products: [
        {
          name: "Nano smoothies",
          priceInCents: totalPrice * 100,
          currency: "gbp",
        },
      ],
      subscriptionId: currentUser?.uid,
      userId: currentUser?.uid!,
    },
    true
  );

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };

  const formattedStartDate = new Intl.DateTimeFormat("en-US", options).format(
    Date.now()
  );

  return (
    <section tw="w-full flex flex-col gap-5 mt-12 border-t border-gray-100 py-5">
      <button onClick={() => setStep(step - 1)}>
        <ArrowLeft color="#8C8C8C" />
      </button>

      <header tw="flex items-center justify-between">
        <div tw="flex items-start flex-col ">
          <Typography.H3 tw="text-black-100 font-semibold">
            Your Order
          </Typography.H3>
          <span tw="flex items-end text-black-100 text-lg font-normal sm:(pt-[8px]) md:(pt-[8px]) lg:(pt-[8px]) xl:(pt-[8px]) hd:(pt-[8px]) 2k:(pt-[8px]) 4k:(pt-[8px])">
            Total: &nbsp;
            <Typography.H4 tw="font-bold text-2xl text-black-100">
              £{totalPrice}/
            </Typography.H4>
            <Typography.P tw=" text-lg text-black-100">month</Typography.P>
          </span>
        </div>
        <div tw="text-right sm:(pt-[8px]) md:(pt-[8px]) lg:(pt-[8px]) xl:(pt-[8px]) hd:(pt-[8px]) 2k:(pt-[8px]) 4k:(pt-[8px])">
          <Typography.P tw="text-black-100 text-lg font-normal opacity-50">
            Step 1 of 2
          </Typography.P>
          <span tw="flex items-end justify-end text-black-100 text-lg font-normal mt-1">
            Starts: &nbsp;
            <span tw="font-semibold ">{formattedStartDate}</span>
          </span>
        </div>
      </header>
      <div
        id="checkout"
        tw={
          "sm:(pt-[8px]) md:(pt-[8px]) lg:(pt-[14px]) xl:(pt-[14px]) hd:(pt-[14px]) 2k:(pt-[14px]) 4k:(pt-[14px])"
        }
      >
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ fetchClientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>

      {/* <SubmitButton title="Continue →" onClick={() => setStep(step + 1)} /> */}
    </section>
  );
}
