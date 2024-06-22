import tw from "twin.macro";
import Typography from "../../../typography";
import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { PurchaseContext } from "../../../../context/PurchaseContext";
import SubmitButton from "../../../buttons/SubmitButton";
import { ArrowLeft } from "iconsax-react";
import BillingDetails from "./BillingDetails";
import ShippingDetails from "./ShippingDetails";
import styled from "@emotion/styled";
import { useUserDetailsContext } from "../../../../context/UserDetailsContext";
import toast from "react-hot-toast";
import useCurrentUserDb from "../../../../hooks/queries/auth/useCurrentUserDb";
import usePostcode from "../../../../hooks/mutations/orders/usePostcode";
import handleError from "../../../../utils/handleError";
import useUserSubscriptions from "../../../../hooks/queries/subscriptions/useUserSubscriptions";
import useCurrentUser from "../../../../hooks/queries/auth/useCurrentUser";
import {
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { firebaseApp } from "../../../../firebase/config";
import useSignUp from "../../../../hooks/mutations/auth/useSignUp";
import generateRandomPassword from "../../../../utils/generateRandomPassword";
import Portal from "../../../portal";
import Modal from "../../../modals/Modal";
import AuthForm from "../../../auth/authForm";
import useSendMail from "../../../../hooks/mutations/orders/useSendMail";
import useCreateSubscription from "../../../../hooks/mutations/subscriptions/useCreateSubscription";
import { ButtonSpinner } from "../../../buttons/buttonSpinner";

type Props = {
  step: number;
  setStep: (step: number) => void;
};

const TabItem = styled.span(({ isActive }: { isActive: boolean }) => [
  isActive
    ? tw`text-mettalic-blue-300 sm:(text-base) md:(text-lg) lg:(text-xl) xl:(text-xl) hd:(text-xl) 2k:(text-2xl) 4k:(text-2xl) font-semibold no-underline cursor-pointer`
    : tw`border-b  sm:(text-base) md:(text-lg) lg:(text-xl) xl:(text-xl) hd:(text-xl) 2k:(text-2xl) 4k:(text-2xl)font-semibold border-dashed border-gray-300 text-gray-300 cursor-pointer`,
]);

export default function YourOrder({ step, setStep }: Props) {
  const postcodeTool = usePostcode();
  const lookupPostcode = postcodeTool.mutate;
  const [formErrors, setFormErrors] = useState<any>(undefined);
  const currentUser = useCurrentUser();
  const currentUserDb = useCurrentUserDb();
  const { totalPrice } = useContext(PurchaseContext);
  const [activeTab, setActiveTab] = useState<"billing" | "shipping">("billing");
  const { userDetailsFormState } = useUserDetailsContext();
  const [shippingDetails, setShippingDetails] = useState<any>();
  const auth = getAuth(firebaseApp);
  const [modalOpen, setModalOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(currentUser);
  const sendMail = useSendMail();

  const password = useMemo(() => {
    return generateRandomPassword(8, {
      includeNumbers: true,
      includeSymbols: true,
    });
  }, []);

  const signup = useSignUp(
    userDetailsFormState.name!,
    userDetailsFormState.email,
    password,
    {
      billingAddress: userDetailsFormState,
      shippingAddress: shippingDetails,
    }
  );

  const isSignUpLoading =
    postcodeTool.isLoading || sendMail.isLoading || signup.isLoading;
  const isLoading = currentUserDb.isInitialLoading;

  // Managing Auth State
  useEffect(() => {
    onAuthStateChanged(auth, (e) => {
      setIsAuth(e);
    });
  }, [auth]);

  useEffect(() => {
    currentUserDb.refetch();
  }, [currentUserDb]);

  // clear form errors on every change
  useEffect(() => {
    setFormErrors(undefined);
  }, [userDetailsFormState]);

  // final success function
  const handleSuccess = useCallback(() => {
    // Check if the user is authenticated then proceed
    if (isAuth) {
      setStep(step + 1);
      return;
    }

    // If user is not authenticated, try to sign up with the email
    signup.mutate(undefined, {
      onSuccess: async () => {
        // Send them a link to change their password
        const pasRes = await sendPasswordResetEmail(
          auth,
          userDetailsFormState.email
        );

        // Send them an email with the email, password and a prompt to change password
        sendMail.mutate(
          {
            subject: "Welcome to Nanosmoothies!",
            to: [
              {
                email: userDetailsFormState.email,
                name: userDetailsFormState.name,
              },
            ],
            firstName: userDetailsFormState.name,
            text: `Hi ${userDetailsFormState.name}, welcome to nanosmoothies. Your current password is ${password}. We've sent a password reset email for you to reset your current password.`,
          },
          {
            onSuccess: () => {
              setStep(step + 1);
            },
            onError: handleError,
          }
        );

        console.log(pasRes);
      },
      onError: (error: any) => {
        // if the error says that the user already exists, pop the login to account modal
        const emailExists = error?.message?.includes("email-already-in-use");
        if (emailExists) {
          setModalOpen(true);
          return;
        }

        toast.error("Oops! You have entered an invalid email address");
      },
    });
  }, [
    step,
    setStep,
    isAuth,
    signup,
    auth,
    password,
    sendMail,
    userDetailsFormState.email,
    userDetailsFormState.name,
  ]);

  const handleProceed = useCallback(() => {
    const compulsoryBilling = [
      userDetailsFormState.street,
      userDetailsFormState.country,
      userDetailsFormState.email,
      userDetailsFormState.name,
      userDetailsFormState.town,
      userDetailsFormState.postcode,
    ];

    if (activeTab === "billing") {
      // Check if all compulsory billing details are filled
      if (!compulsoryBilling.every((val) => !!val) && !!lookupPostcode) {
        toast.error("Please fill in your billing details");
        return;
      }

      // Switch to the shipping tab
      setActiveTab("shipping");
      return;
    }

    if (activeTab === "shipping") {
      // Check if all shipping details are filled
      if (!shippingDetails) {
        toast.error("Please fill in your shipping details");
        return;
      }
    }
    // when they proceed
    // const handleProceed = useCallback(() => {
    //   const compulsoryBilling = [
    //     userDetailsFormState.street,
    //     userDetailsFormState.country,
    //     userDetailsFormState.email,
    //     userDetailsFormState.name,
    //     userDetailsFormState.town,
    //     userDetailsFormState.postcode,
    //   ];

    //   // if there's no billing or shipping details, ask them to fill the fields
    //   if (!compulsoryBilling.every((val) => !!val)) {
    //     toast.error("Please fill in your billing details");
    //     return;
    //   }

    //   if (!shippingDetails) {
    //     setShippingDetails(compulsoryBilling);
    //     // toast.error("Please fill in your shipping details");
    //     // return;
    //   }

    // check postcode
    lookupPostcode(userDetailsFormState.postcode, {
      onSuccess: (res) => {
        console.log(res);
        if (res.status !== 200) {
          toast.error("Invalid post code");
          setFormErrors({ postcode: "Invalid post code" });
          return true;
        }
        handleSuccess();
        setFormErrors(undefined);
      },

      onError: (e) => {
        setFormErrors({ postcode: "Invalid post code" });

        toast.error("Invalid postcode");
        console.log(e);
        setActiveTab("billing");
        return false;
      },
    });
  }, [
    shippingDetails,
    lookupPostcode,
    userDetailsFormState.country,
    userDetailsFormState.email,
    userDetailsFormState.name,
    userDetailsFormState.postcode,
    userDetailsFormState.street,
    userDetailsFormState.town,
    handleSuccess,
    activeTab,
  ]);

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };

  const formattedStartDate = new Intl.DateTimeFormat("en-US", options).format(
    Date.now()
  );

  return (
    <Fragment>
      <section tw="w-full flex flex-col gap-5 mt-12 border-t border-gray-100  py-5 sm:(px-5)">
        <button onClick={() => setStep(step - 1)} tw="sm:(left-0)">
          <ArrowLeft color="#8C8C8C" />
        </button>

        <header tw="flex flex-col sm:(flex-row items-center justify-between) gap-2">
          <div tw="flex flex-col items-start gap-[26px] ">
            <Typography.H3 tw="text-black-100 font-semibold ">
              Your Order
            </Typography.H3>
            <div tw="flex  gap-2 sm:(gap-1) items-baseline">
              <span tw="text-black-100 sm:(text-[14px]) md:(text-[16px]) lg:(text-base) xl:(text-lg) hd:(text-lg) 2k:(text-xl) 4k:(text-xl)">
                Total: &nbsp;
              </span>
              <Typography.H4 tw="font-semibold sm:(text-[22px]) md:(text-[24px]) lg:(text-lg) xl:(text-xl) hd:(text-2xl) 2k:(text-3xl) 4k:(text-3xl)">
                £{totalPrice}/
              </Typography.H4>
              <Typography.P tw="text-lg text-black-100 sm:(text-[14px]) md:(text-[16px]) lg:(text-base) xl:(text-lg) hd:(text-lg) 2k:(text-xl) 4k:(text-xl)">
                month
              </Typography.P>
            </div>
          </div>
          <div tw="flex flex-col text-right items-start gap-[26px] ">
            <Typography.P tw="text-black-100 text-lg font-normal opacity-50 sm:(text-[14px]) md:(text-[16px]) lg:(text-lg) xl:(text-lg) hd:(text-xl) 2k:(text-2xl) 4k:(text-2xl)">
              Step 1 of 2
            </Typography.P>
            <div tw="flex items-center gap-2 sm:(gap-1) items-baseline">
              <span tw="text-black-100 text-lg font-normal sm:(text-[14px]) md:(text-[16px]) lg:(text-lg) xl:(text-lg) hd:(text-xl) 2k:(text-2xl) 4k:(text-2xl)">
                Starts: &nbsp;
              </span>
              <span tw="font-semibold sm:(text-[19px]) md:(text-[21px]) lg:(text-lg) xl:(text-xl) hd:(text-2xl) 2k:(text-3xl) 4k:(text-3xl)">
                {formattedStartDate}
              </span>
            </div>
          </div>
        </header>

        <div tw="w-full flex items-center mt-4 gap-16 mb-1 sm:(mb-0)">
          <TabItem
            isActive={activeTab === "billing"}
            onClick={() => setActiveTab("billing")}
            tw="sm:(pt-[8px])"
          >
            Billing Details
          </TabItem>
          <TabItem
            isActive={activeTab === "shipping"}
            onClick={() => setActiveTab("shipping")}
            tw="sm:(pt-[8px])"
          >
            Shipping Details
          </TabItem>
        </div>

        {activeTab === "billing" && <BillingDetails formError={formErrors} />}
        {activeTab === "shipping" && (
          <ShippingDetails
            shippingDetails={shippingDetails}
            setShippingDetails={setShippingDetails}
            formError={formErrors}
          />
        )}

        {/* <main tw="mt-5">
          {step === 0 && <BillingDetails formError={formErrors} />}
          {step === 1 && (
            <ShippingDetails
              shippingDetails={shippingDetails}
              setShippingDetails={setShippingDetails}
              formError={formErrors}
            />
          )}
        </main> */}

        <SubmitButton
          isLoading={isSignUpLoading}
          disabled={isSignUpLoading}
          title="Continue →"
          onClick={handleProceed}
          tw="sm:(mt-4)"
        />
      </section>

      <Portal isOpen={modalOpen}>
        <Modal>
          <AuthForm
            headingText="You already have an account, please sign in"
            isModal
            onClose={() => {
              setModalOpen(false);
            }}
            onSuccess={() => {
              setModalOpen(false);
            }}
          />
        </Modal>
      </Portal>
    </Fragment>
  );
}
