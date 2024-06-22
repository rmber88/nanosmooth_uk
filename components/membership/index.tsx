import { Fragment, useState } from "react";
import tw from "twin.macro";
import ClickReveal from "../ClickReveal";
import ProductCalc from "../home/Description/ProductCalc";
import Typography from "../typography";
import useSignOut from "../../hooks/mutations/auth/useSignOut";
import { useRouter } from "next/router";
import { useUserDetailsContext } from "../../context/UserDetailsContext";
import useCurrentUserDb from "../../hooks/queries/auth/useCurrentUserDb";
import Email from "./Email";
import Password from "./Password";
import BillingDetails from "./BillingDetails";
import ShippingDetails from "./ShippingDetails";
import Subscription from "./Subscription";
import BillingDate from "./billingDate";
import Portal from "../portal";
import Modal from "../modals/Modal";
import CancelOrderModal from "./cancelOrderModal";
import useUserSubscriptions from "../../hooks/queries/subscriptions/useUserSubscriptions";
import NumberOfBoxes from "./NumberOfBoxes";

export default function Membership() {
  const signOut = useSignOut();
  const userSubscription = useUserSubscriptions();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [submitTrigger, setSubmitTrigger] = useState<{
    [key: string]: boolean;
  }>({});

  const userHasSubscription =
    !!userSubscription.data?.isActive && !!userSubscription.data?.stripeId;

  const nextBillingDate = new Date(
    userSubscription?.data?.endDate ?? Date.now()
  ).toDateString();

  const handleLogout = () => {
    router.push("/");
    signOut.signOut();
  };

  const handleExpand = (section: string) => {
    setExpandedSection((prevSection) =>
      prevSection === section ? null : section
    );
  };

  const handleSave = (data: string) => {
    console.log(`Saving data for:`, data);
    setSubmitTrigger((prev) => ({ ...prev, [data]: true }));
  };

  const resetSubmitTrigger = (section: string) => {
    setSubmitTrigger((prev) => ({ ...prev, [section]: false }));
  };

  return (
    <section tw="flex flex-col w-[30%] sm:(w-[100%]) md:(w-[100%]) lg:(w-[40%]) xl:(w-[35%]) hd:(w-[30%]) 2k:(w-[40%]) 4k:(w-[40%])">
      <Typography.H1 tw="text-black-100 opacity-30  text-center font-medium  sm:( pt-[2%]) md:(pt-[2%]) lg:(font-semibold text-2xl pt-[8%]) xl:(font-semibold text-5xl pt-[8%]) hd:(font-semibold text-4xl pt-[8%]) 2k:( font-semibold text-5xl pt-[8%]) 4k:( font-semibold text-5xl pt-[8%])">
        Your Membership
      </Typography.H1>

      <Typography.H1 tw="text-black-100 opacity-30  text-center font-medium  sm:(text-base pt-[2%]) md:(pt-[2%]) lg:(font-semibold text-sm pt-[2%]) xl:(font-semibold text-lg pt-[2%]) hd:(font-semibold text-lg pt-[2%]) 2k:( font-semibold text-2xl pt-[2%]) 4k:( font-semibold text-2xl pt-[2%])">
        Next billing date is going to be {nextBillingDate}
      </Typography.H1>

      <section tw="w-full ">
        <section tw="mt-8 2k:(mt-12) 4k:(mt-12)  " />
        <ClickReveal
          title="Number of boxes"
          tw=" border-t border-neutral-100"
          isExpanded={expandedSection === "Number of boxes"}
          onExpand={() => handleExpand("Number of boxes")}
          showButtons={false}
        >
          <NumberOfBoxes
            onCancel={() => handleExpand("")}
            onSave={() => handleExpand("")}
          />
        </ClickReveal>

        <ClickReveal
          title="Email"
          isExpanded={expandedSection === "Email"}
          onExpand={() => handleExpand("Email")}
          onSave={() => {
            handleSave("email");
          }}
          submitTrigger={submitTrigger["email"]}
        >
          <Email
            submitTrigger={submitTrigger["email"]}
            onSubmitSuccess={() => {
              resetSubmitTrigger("email");
              handleExpand("");
            }}
          />
        </ClickReveal>
        <ClickReveal
          title="Password"
          isExpanded={expandedSection === "Password"}
          onExpand={() => handleExpand("Password")}
          onSave={() => handleSave("password")}
          submitTrigger={submitTrigger["password"]}
        >
          <Password
            submitTrigger={submitTrigger["password"]}
            onSubmitSuccess={() => {
              resetSubmitTrigger("password");
              handleExpand("");
            }}
          />
        </ClickReveal>
        <ClickReveal
          title="Billing Details"
          onSave={() => handleSave("billing_detail")}
          isExpanded={expandedSection === "Billing Details"}
          onExpand={() => handleExpand("Billing Details")}
        >
          <BillingDetails
            submitTrigger={submitTrigger["billing_detail"]}
            onSubmitSuccess={() => {
              resetSubmitTrigger("billing_detail");
              handleExpand("");
            }}
          />
        </ClickReveal>
        <ClickReveal
          title="Shipping Details"
          onSave={() => handleSave("shipping_detail")}
          isExpanded={expandedSection === "Shipping Details"}
          onExpand={() => handleExpand("Shipping Details")}
        >
          <ShippingDetails
            submitTrigger={submitTrigger["shipping_detail"]}
            onSubmitSuccess={() => {
              resetSubmitTrigger("shipping_detail");
              handleExpand("");
            }}
          />
        </ClickReveal>

        <Fragment>
          {userHasSubscription && (
            <ClickReveal
              title="Cancel Subscription"
              onSave={() => setModalOpen(true)}
              isExpanded={expandedSection === "cancel_order"}
              onExpand={() => setModalOpen(true)}
            ></ClickReveal>
          )}
        </Fragment>

        <button
          tw="text-center text-red-500 w-full text-lg mt-[6%]"
          onClick={handleLogout}
        >
          Logout
        </button>

        <Portal isOpen={modalOpen}>
          <Modal>
            <CancelOrderModal
              onClose={() => {
                setModalOpen(false);
              }}
              onSuccess={() => {
                setModalOpen(false);
              }}
            />
          </Modal>
        </Portal>
      </section>
    </section>
  );
}
