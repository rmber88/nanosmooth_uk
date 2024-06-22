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

type CancelOrderModalProps = {
  children?: ReactNode;
  aside?: boolean;
  onClose?: MouseEventHandler;
  onSuccess?: VoidFunction;
  disableClose?: boolean;
};

export default function CancelOrderModal({
  children,
  disableClose,
  onClose,
  onSuccess,
  ...otherProps
}: CancelOrderModalProps) {
  const subscription = useUserSubscriptions();
  const currentuser = useCurrentUser();
  const cancelSub = useCancelSubscription();

  const handleCancelSubscription = useCallback(() => {
    const data = {
      customerId: currentuser?.uid!,
      subscriptionId: subscription.data?.stripeId!,
    };

    cancelSub.mutate(data, {
      onError: handleError,
      onSuccess: () => {
        toast.success("Subscription cancelled!");
        onSuccess?.();
      },
    });
  }, [cancelSub, currentuser?.uid, onSuccess, subscription.data?.stripeId]);

  const isLoading = cancelSub.isLoading;

  return (
    <Fragment>
      <ModalWrapper tw={"w-[35%] "} {...otherProps}>
        <section tw="flex py-[8px] flex-col overflow-hidden rounded-2xl lg:flex-row ">
          <div tw=" mt-8 px-6 w-full">
            {!disableClose && (
              <button
                tw="hover:scale-105 absolute top-4 right-4"
                onClick={onClose}
              >
                <CloseCircle />
              </button>
            )}

            <div tw=" w-full">
              <Typography.H3 tw=" pt-8 pb-8  text-center font-semibold text-black-100">
                Are you sure you want to cancel your subscription?
              </Typography.H3>
              <Typography.P tw="text-center pb-12 text-sm font-light text-black-100">
                If you confirm cancellation you will not get the next box of{" "}
                <span tw=" font-bold ">nano</span>
                <span tw="font-normal">smoothies</span>
                <span>®</span>. Proceed?
              </Typography.P>
            </div>
            {isLoading ? (
              <span tw="flex justify-center gap-2 ">
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
      <ModalBackDrop />
    </Fragment>
  );
}
