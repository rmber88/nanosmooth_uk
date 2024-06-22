import { FormEvent, useCallback, useContext } from "react";
import tw from "twin.macro";
import ProductCalc from "../home/Description/ProductCalc";
import ButtonGroup from "../buttonGroup";
import ActionButton from "../buttons/ActionButton";
import useUpdateSubscrption from "../../hooks/mutations/subscriptions/useUpdateSubscription";
import { PurchaseContext } from "../../context/PurchaseContext";
import { ButtonSpinner } from "../buttons/buttonSpinner";
import handleError from "../../utils/handleError";

type Props = {
  onSave: VoidFunction;
  onCancel: VoidFunction;
};

export default function NumberOfBoxes({ onCancel, onSave }: Props) {
  const updateSubscription = useUpdateSubscrption();
  const { totalPrice, totalSachets: quantity } = useContext(PurchaseContext);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      updateSubscription.mutate(
        { totalPrice, quantity },
        {
          onSuccess: () => {
            onSave();
          },
          onError: handleError,
        }
      );
    },
    [onSave, updateSubscription, quantity, totalPrice]
  );

  return (
    <form id="Number_of_boxes" onSubmit={handleSubmit}>
      <ProductCalc showButton={true} tw="px-2" />

      <span tw="flex flex-row gap-6 place-content-around pb-6 lg:(pt-2) xl:(pt-2) hd:(pt-4) 2k:(pt-4) 4k:(pt-4)">
        <ActionButton
          title={"Cancel"}
          tw="w-1/2  border border-neutral-100 text-center text-black-100 text-base font-medium   max-h-12  sm:(max-h-16 text-sm) lg:(max-h-16 text-lg) 2k:(px-[40px] py-[13.33px] text-lg) 4k:(px-[40px] py-[13.33px] text-xl) "
          onClick={onCancel}
        />
        <button
          type="submit"
          tw="bg-[#1A202E] cursor-pointer flex items-center justify-center px-3 py-2  rounded-md transition-all
          hover:(text-white-100 bg-gray-400) w-1/2 text-center text-white-100 text-base font-medium  max-h-12  sm:(max-h-16 text-sm) lg:(max-h-16 text-lg) 2k:(px-[40px] py-[13.33px] text-lg) 4k:(px-[40px] py-[13.33px] text-xl)"
        >
          {updateSubscription.isLoading ? ButtonSpinner : "Save Changes"}
        </button>
      </span>
    </form>
  );
}
