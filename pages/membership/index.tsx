import tw from "twin.macro";
import Wrapper from "../../components/layouts/wrapper";
import Navbar from "../../components/layouts/reusable/Navbar";
import MobileNav from "../../components/layouts/reusable/MobileNav";
import useCurrentUser from "../../hooks/queries/auth/useCurrentUser";
import MembershipEngine from "../../components/membership";
import AuthForm from "../../components/auth/authForm";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firebaseApp } from "../../firebase/config";
import SEOConfig from "../../components/SEO";
import Portal from "../../components/portal";
import Modal from "../../components/modals/Modal";
import useSessionStatus from "../../hooks/queries/orders/useSessionStatus";
import toast from "react-hot-toast";
import { ButtonSpinner } from "../../components/buttons/buttonSpinner";
import Typography from "../../components/typography";
import { CloseCircle, TickCircle } from "iconsax-react";
import Link from "next/link";
import useUserSubscriptions from "../../hooks/queries/subscriptions/useUserSubscriptions";
import useDeleteCurrentUser from "../../hooks/mutations/auth/useDeleteCurrentUser";
import handleError from "../../utils/handleError";

export default function Membership() {
  const auth = getAuth(firebaseApp);
  const currentUser = useCurrentUser();
  const userSubscription = useUserSubscriptions();
  const [isAuth, setIsAuth] = useState(currentUser);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userId = router.query?.uid?.toString();
  const sessionId = router.query?.session_id?.toString();
  const orderId = router.query?.order_id?.toString();

  const isNotInitialSubscribed =
    !!isAuth && !!userSubscription.data && !userSubscription.data?.stripeId;
  const deleteCurrUser = useDeleteCurrentUser();

  const modalAction = useCallback(
    (action: "close" | "open") => {
      if (action === "open") {
        setIsModalOpen(true);
      }

      if (action === "close") {
        router.push("/membership");
        setIsModalOpen(false);
      }
    },
    [router]
  );

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

  // Handling returns
  useEffect(() => {
    if (!!sessionId) {
      setIsModalOpen(true);
    }
  }, [sessionId]);

  // Handling Subscriptions
  useEffect(() => {
    if (!data) {
      return;
    }

    console.log({ data });
    if (data.status === "open") {
      // send them back to retry the payment
      toast.error("Payment failed");
    }
  }, [data]);

  // Managing Auth State
  useEffect(() => {
    onAuthStateChanged(auth, (e) => {
      setIsAuth(e);
    });
  }, [auth]);

  // Removing user accounts if they aren't subscribed
  useEffect(() => {
    if (!isNotInitialSubscribed) {
      return;
    }

    // remove account
    deleteCurrUser.mutate(undefined, {
      onError: handleError,
    });
  }, [isNotInitialSubscribed, deleteCurrUser]);

  return (
    <main tw="w-full bg-gradient-to-b from-neutral-100">
      <SEOConfig title="Membership" />
      <Navbar />
      <MobileNav />

      <Wrapper tw="pt-32 sm:(pt-12) md:(pt-12) lg:(pt-32) w-full flex flex-col items-center justify-center mb-24">
        {!!isAuth ? <MembershipEngine /> : <AuthForm />}
      </Wrapper>

      <Portal isOpen={isModalOpen}>
        <Modal onClose={() => modalAction("close")}>
          {isLoading && (
            <div tw="flex gap-2 flex-col items-center justify-center text-center my-12 min-h-[20vh]  py-20">
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
            tw="flex flex-col gap-5 items-center justify-center text-center min-h-[16vh] py-20"
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

            <button
              tw="rounded-xl px-4 py-2 border shadow transition-all hover:(bg-gray-50)"
              onClick={() => modalAction("close")}
            >
              Back home
            </button>
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
              tw="rounded-xl px-4 py-2 border shadow transition-all hover:(bg-gray-50)"
              onClick={router.back}
            >
              Try again
            </button>
          </article>
        </Modal>
      </Portal>
    </main>
  );
}
