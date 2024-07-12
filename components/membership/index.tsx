// Import necessary hooks and components from React and other dependencies
import { Fragment, useState } from "react";
import tw from "twin.macro"; // Import Twin.macro for styled components
import ClickReveal from "../ClickReveal"; // Import ClickReveal component
import ProductCalc from "../home/Description/ProductCalc"; // Import ProductCalc component
import Typography from "../typography"; // Import Typography component
import useSignOut from "../../hooks/mutations/auth/useSignOut"; // Import custom sign-out hook
import { useRouter } from "next/router"; // Import useRouter for navigation
import { useUserDetailsContext } from "../../context/UserDetailsContext"; // Import UserDetailsContext
import useCurrentUserDb from "../../hooks/queries/auth/useCurrentUserDb"; // Import custom hook to get current user from DB
import Email from "./Email"; // Import Email component
import Password from "./Password"; // Import Password component
import BillingDetails from "./BillingDetails"; // Import BillingDetails component
import ShippingDetails from "./ShippingDetails"; // Import ShippingDetails component
import Subscription from "./Subscription"; // Import Subscription component
import BillingDate from "./billingDate"; // Import BillingDate component
import Portal from "../portal"; // Import Portal component for modals
import Modal from "../modals/Modal"; // Import Modal component
import CancelOrderModal from "./cancelOrderModal"; // Import CancelOrderModal component
import useUserSubscriptions from "../../hooks/queries/subscriptions/useUserSubscriptions"; // Import custom hook for user subscriptions
import NumberOfBoxes from "./NumberOfBoxes"; // Import NumberOfBoxes component

// Define the main component for the Membership page
export default function Membership() {
  const signOut = useSignOut(); // Hook to handle sign out
  const userSubscription = useUserSubscriptions(); // Hook to get user subscription data
  const router = useRouter(); // Router hook for navigation
  const [modalOpen, setModalOpen] = useState(false); // State to manage modal open state
  const [expandedSection, setExpandedSection] = useState<string | null>(null); // State to manage expanded sections
  const [submitTrigger, setSubmitTrigger] = useState<{
    [key: string]: boolean;
  }>({}); // State to manage form submission triggers

  // Determine if the user has an active subscription
  const userHasSubscription =
    !!userSubscription.data?.isActive && !!userSubscription.data?.stripeId;

  // Get the next billing date from user's subscription data
  const nextBillingDate = new Date(
    userSubscription?.data?.endDate ?? Date.now()
  ).toDateString();

  // Handle user logout
  const handleLogout = () => {
    router.push("/"); // Navigate to home page
    signOut.signOut(); // Sign out the user
  };

  // Handle section expansion/collapse
  const handleExpand = (section: string) => {
    setExpandedSection((prevSection) =>
      prevSection === section ? null : section
    );
  };

  // Handle form save and trigger submission
  const handleSave = (data: string) => {
    console.log(`Saving data for:`, data);
    setSubmitTrigger((prev) => ({ ...prev, [data]: true }));
  };

  // Reset the submit trigger for a specific section
  const resetSubmitTrigger = (section: string) => {
    setSubmitTrigger((prev) => ({ ...prev, [section]: false }));
  };

  return (
    <section tw="flex flex-col w-[30%] sm:(w-[100%]) md:(w-[100%]) lg:(w-[40%]) xl:(w-[35%]) hd:(w-[30%]) 2k:(w-[40%]) 4k:(w-[40%])">
      <Typography.H1 tw="text-black-100 opacity-30 text-center font-medium sm:(pt-[2%]) md:(pt-[2%]) lg:(font-semibold text-2xl pt-[8%]) xl:(font-semibold text-5xl pt-[8%]) hd:(font-semibold text-4xl pt-[8%]) 2k:(font-semibold text-5xl pt-[8%]) 4k:(font-semibold text-5xl pt-[8%])">
        Your Membership
      </Typography.H1>

      <Typography.H1 tw="text-black-100 opacity-30 text-center font-medium sm:(text-base pt-[2%]) md:(pt-[2%]) lg:(font-semibold text-sm pt-[2%]) xl:(font-semibold text-lg pt-[2%]) hd:(font-semibold text-lg pt-[2%]) 2k:(font-semibold text-2xl pt-[2%]) 4k:(font-semibold text-2xl pt-[2%])">
        Next billing date is going to be {nextBillingDate}
      </Typography.H1>

      <section tw="w-full ">
        <section tw="mt-8 2k:(mt-12) 4k:(mt-12) " />

        {/* Section for updating the number of boxes */}
        <ClickReveal
          title="Number of boxes"
          tw="border-t border-neutral-100"
          isExpanded={expandedSection === "Number of boxes"}
          onExpand={() => handleExpand("Number of boxes")}
          showButtons={false}
        >
          <NumberOfBoxes
            onCancel={() => handleExpand("")}
            onSave={() => handleExpand("")}
          />
        </ClickReveal>

        {/* Section for updating the email */}
        <ClickReveal
          title="Email"
          isExpanded={expandedSection === "Email"}
          onExpand={() => handleExpand("Email")}
          onSave={() => handleSave("email")}
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

        {/* Section for updating the password */}
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

        {/* Section for updating billing details */}
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

        {/* Section for updating shipping details */}
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

        {/* Logout button */}
        <button
          tw="text-center text-red-500 w-full text-lg mt-[6%]"
          onClick={handleLogout}
        >
          Logout
        </button>

        {/* Modal for cancelling the order */}
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
