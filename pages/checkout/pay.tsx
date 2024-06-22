import { useRouter } from "next/router";
import { useEffect } from "react";
import tw from "twin.macro";
import { useCart } from "../../context/CartContext";

import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import useInitCheckout from "../../hooks/mutations/orders/useInitCheckout";
import useCurrentUser from "../../hooks/queries/auth/useCurrentUser";
import toast from "react-hot-toast";
import Wrapper from "../../components/layouts/wrapper";
import SEOConfig from "../../components/SEO";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK!);

export default function Pay() {
  const router = useRouter();

  const currentUser = useCurrentUser();
  const orderId = router.query.order_id?.toString()!;

  const { cartItems } = useCart();

  useEffect(() => {
    if (!currentUser && !orderId) {
      toast.error("Please try again");
      router.replace("/nano");
    }
  }, [currentUser, orderId, router]);

  const { fetchClientSecret } = useInitCheckout({
    userId: currentUser?.uid!,
    customerEmail: currentUser?.email!,
    products: cartItems.map((item) => {
      return {
        name: item.name,
        priceInCents: 900 * item.quantity,
        currency: "gbp",
      };
    }),
    orderId,

  });

  return (
    <main>
      <SEOConfig title="Pay" />

      <Wrapper>
        <section tw="w-full flex flex-col gap-5 mt-12 border-t border-gray-100 py-5">
          <div id="checkout">
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ fetchClientSecret }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        </section>
      </Wrapper>
    </main>
  );
}
