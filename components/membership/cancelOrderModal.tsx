import tw from "twin.macro";
import { Fragment, MouseEventHandler, ReactNode, useCallback } from "react";
import ModalBackDrop from "../modals/ModalBackdrop";
import ModalWrapper from "../modals/ModalWrapper";
import Typography from "../typography";
import ButtonGroup from "../buttonGroup";
import { CloseCircle } from "iconsax-react";
import useUserSubscriptions from "../../hooks/queries/subscriptions/useUserSubscriptions";
import useCancelSubscription from "../../hooks/mutations/orders/cancelSubscription";
import handleError from "../../utils/handleError";
import toast from "react-hot-toast";
import useCurrentUser from "../../hooks/queries/auth/useCurrentUser";
import { ButtonSpinner } from "../buttons/buttonSpinner";

// Define the props for the CancelOrderModal component.
// It includes optional children, aside, onClose, onSuccess, and disableClose properties.
type CancelOrderModalProps = {
  children?: ReactNode;
  aside?: boolean;
  onClose?: MouseEventHandler;
  onSuccess?: VoidFunction;
  disableClose?: boolean;
};

// Define the CancelOrderModal component which accepts CancelOrderModalProps.
export default function CancelOrderModal({
  children,
  disableClose,
  onClose,
  onSuccess,
  ...otherProps
}: CancelOrderModalProps) {
  // Custom hook to fetch user subscriptions.
  const subscription = useUserSubscriptions();

  // Custom hook to fetch current user data.
  const currentuser = useCurrentUser();

  // Custom hook to handle subscription cancellation.
  const cancelSub = useCancelSubscription();

  // useCallback hook to memoize the handleCancelSubscription function.
  const handleCancelSubscription = useCallback(() => {
    // Data required to cancel the subscription.
    const data = {
      customerId: currentuser?.uid!,
      subscriptionId: subscription.data?.stripeId!,
    };

    // Call the mutation to cancel the subscription.
    cancelSub.mutate(data, {
      onError: handleError,
      onSuccess: () => {
        // Display success toast notification and call onSuccess callback if provided.
        toast.success("Subscription cancelled!");
        onSuccess?.();
      },
    });
  }, [cancelSub, currentuser?.uid, onSuccess, subscription.data?.stripeId]);

  // Check if the cancellation request is loading.
  const isLoading = cancelSub.isLoading;

  return (
    <Fragment>
      {/* Modal Wrapper for the cancel order modal */}
      <ModalWrapper tw={"w-[35%] "} {...otherProps}>
        <section tw="flex py-[8px] flex-col overflow-hidden rounded-2xl lg:flex-row">
          <div tw="mt-8 px-6 w-full">
            {!disableClose && (
              <button
                tw="hover:scale-105 absolute top-4 right-4"
                onClick={onClose}
              >
                <CloseCircle />
              </button>
            )}

            <div tw="w-full">
              <Typography.H3 tw="pt-8 pb-8 text-center font-semibold text-black-100">
                Are you sure you want to cancel your subscription?
              </Typography.H3>
              <Typography.P tw="text-center pb-12 text-sm font-light text-black-100">
                If you confirm cancellation you will not get the next box of{" "}
                <span tw="font-bold">nano</span>
                <span tw="font-normal">smoothies</span>
                <span>®</span>. Proceed?
              </Typography.P>
            </div>
            {isLoading ? (
              <span tw="flex justify-center gap-2">
                {ButtonSpinner} loading...
              </span>
            ) : (
              <ButtonGroup
                onCancel={handleCancelSubscription}
                onSave={() => {
                  onSuccess?.();
                }}
                primaryBtnTitle={"Yes, cancel order"}
                secondaryBtnTitle={"No, stay subscribed"}
              />
            )}
          </div>
        </section>
      </ModalWrapper>
      {/* Modal backdrop to cover the rest of the screen */}
      <ModalBackDrop />
    </Fragment>
  );
}
