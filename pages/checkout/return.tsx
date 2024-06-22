import tw from "twin.macro";
import Navbar from "../../components/layouts/reusable/Navbar";
import MobileNav from "../../components/layouts/reusable/MobileNav";
import Wrapper from "../../components/layouts/wrapper";
import { useRouter } from "next/router";
import useSessionStatus from "../../hooks/queries/orders/useSessionStatus";
import { ButtonSpinner } from "../../components/buttons/buttonSpinner";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Typography from "../../components/typography";
import { CloseCircle, TickCircle } from "iconsax-react";
import Link from "next/link";

import SEOConfig from "../../components/SEO";

// maybe instead of using cloud functions, we use the next.js API route

export default function Return() {
  const router = useRouter();

  const userId = router.query?.uid?.toString();
  const sessionId = router.query?.session_id?.toString();
  const orderId = router.query?.order_id?.toString();

  const {
    data,
    isLoading: sessionLoading,
    error,
  } = useSessionStatus({
    sessionId,
    orderId,
    userId,
  });
  const isLoading = sessionLoading;

  // SUBSCRIPTIONS

  useEffect(() => {
    if (!data) {
      return;
    }

    if (data.status === "open") {
      // send them back to retry the payment
      toast.error("Payment failed");
    }
  }, [data]);

  return (
    <main>
      <SEOConfig title="Verify" />

      <Navbar />
      <MobileNav />

      <Wrapper tw="pt-32 mb-14 w-full max-w-md mx-auto">
        {isLoading && (
          <div tw="flex gap-2 flex-col items-center justify-center text-center my-12 min-h-screen py-20">
            <span>{ButtonSpinner}</span>
            <Typography.P>
              Just a sec... Please don&apos;t close this page
            </Typography.P>
          </div>
        )}

        {!isLoading && !!error && (
          <div tw="p-5 bg-red-50 text-red-700 mb-6 rounded-xl">
            {(error as any)?.response?.data?.message?.toString()}
          </div>
        )}

        {/* successful */}
        <article
          tw="flex flex-col gap-5 items-center items-center justify-center text-center min-h-[16vh] py-20"
          id="Success"
          style={{
            display:
              data?.status === "complete" && !isLoading ? "flex" : "none",
          }}
        >
          <div tw="grid p-8 rounded-full place-content-center bg-green-50 text-green-600">
            <TickCircle size={32} />
          </div>

          <div tw="text-center">
            <Typography.H3 tw="mb-2">Payment successful!</Typography.H3>
            <Typography.P isGrey>
              Your payment has been completed successfully!
            </Typography.P>
          </div>

          <Link
            tw="rounded-xl px-4 py-2 mb-[4%] border shadow transition-all hover:(bg-gray-50)"
            href={"/"}
          >
            Redirecting to your account portal
          </Link>
        </article>

        {/* Unsuccessful */}
        <article
          tw="flex flex-col gap-5 items-center"
          id="Failure"
          style={{
            display: data?.status === "open" && !isLoading ? "flex" : "none",
          }}
        >
          <div tw="grid p-8 rounded-full place-content-center bg-red-50 text-red-600">
            <CloseCircle size={32} />
          </div>

          <div tw="text-center">
            <Typography.H3 tw="mb-2">Payment failed</Typography.H3>
            <Typography.P isGrey>
              Stripe wasn&apos;t able to process your payment at this time.
              Please try again.
            </Typography.P>
          </div>

          <button
            tw="rounded-xl px-4 py-2 mb-[4%] border shadow transition-all hover:(bg-gray-50)"
            onClick={router.back}
          >
            Try again
          </button>
        </article>
      </Wrapper>
    </main>
  );
}
