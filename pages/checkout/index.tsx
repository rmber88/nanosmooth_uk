import tw from "twin.macro";
import Image from "next/image";
import CheckoutForm from "./CheckoutForm";
import Navbar from "../../components/layouts/reusable/Navbar";
import Wrapper from "../../components/layouts/wrapper";
import Typography from "../../components/typography";
import { useCart } from "../../context/CartContext";
import MobileNav from "../../components/layouts/reusable/MobileNav";
import useCurrentUser from "../../hooks/queries/auth/useCurrentUser";
import { useLayoutEffect, useState } from "react";
import Portal from "../../components/portal";
import Modal from "../../components/modals/Modal";
import AuthForm from "../../components/auth/authForm";
import useCurrentUserDb from "../../hooks/queries/auth/useCurrentUserDb";
import { ButtonSpinner } from "../../components/buttons/buttonSpinner";
import SEOConfig from "../../components/SEO";
import dotted from "public/icons/dotted.svg";

export default function Checkout() {
  const currentUser = useCurrentUser();
  const currentUserDb = useCurrentUserDb();
  const [modalOpen, setModalOpen] = useState(false);
  const { totalPrice } = useCart();

  useLayoutEffect(() => {
    if (!currentUser) {
      setModalOpen(true);
    }
  }, [currentUser]);

  return (
    <main>
      <SEOConfig title="Checkout" />

      <Navbar />
      <MobileNav />

      <Wrapper tw="pt-32 sm:(pt-2) mb-14 w-full flex flex-wrap lg:flex-nowrap items-center lg:items-start justify-center lg:justify-between gap-24">
        <div>{currentUserDb.isLoading && ButtonSpinner}</div>
        <CheckoutForm />
        <aside tw="lg:w-[50%] w-full flex flex-col gap-5">
          <div tw="flex items-center justify-between w-full lg:(pt-[30%])">
            <Typography.P tw="!text-blue-500 !font-bold">Subtotal</Typography.P>
            <div tw="flex-grow mx-4">
              <Image src={dotted} alt="dotted" tw="w-full" />
            </div>
            <Typography.P tw="!text-blue-500 !font-bold">
              £{totalPrice}
            </Typography.P>
          </div>

          <div tw="flex items-center justify-between w-full">
            <Typography.P tw="!text-blue-500">Delivery</Typography.P>
            <div tw="flex-grow mx-4">
              <Image src={dotted} alt="dotted" tw="w-full" />
            </div>
            <Typography.P tw="!text-blue-500">Free</Typography.P>
          </div>

          <div tw="flex items-center justify-between">
            <Typography.P tw="!text-blue-500">
              {" "}
              Shipping to United Kingdom (UK)
            </Typography.P>
          </div>

          <div tw="flex items-center justify-between">
            <Typography.P tw="!text-blue-500 !font-bold">Total</Typography.P>
            <Typography.P tw="!text-blue-500 !font-bold">
              £ {totalPrice}
            </Typography.P>
          </div>
        </aside>
      </Wrapper>

      {/* Modals */}
      <Portal isOpen={modalOpen}>
        <Modal
          onClose={() => {
            setModalOpen(false);
          }}
        >
          <AuthForm
            isModal
            onSuccess={() => {
              setModalOpen(false);
              currentUserDb.refetch();
            }}
          />
        </Modal>
      </Portal>
    </main>
  );
}
