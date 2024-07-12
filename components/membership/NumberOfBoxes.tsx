// Import necessary hooks and components from React and other dependencies
import { FormEvent, useCallback, useContext } from "react";
import tw from "twin.macro"; // Import Twin.macro for styled components
import ProductCalc from "../home/Description/ProductCalc"; // Import ProductCalc component
import ButtonGroup from "../buttonGroup"; // Import ButtonGroup component
import ActionButton from "../buttons/ActionButton"; // Import ActionButton component
import useUpdateSubscrption from "../../hooks/mutations/subscriptions/useUpdateSubscription"; // Custom hook to update subscription
import { PurchaseContext } from "../../context/PurchaseContext"; // Import PurchaseContext
import { ButtonSpinner } from "../buttons/buttonSpinner"; // Import ButtonSpinner component
import handleError from "../../utils/handleError"; // Utility function to handle errors

// Define the type for the component props
type Props = {
  onSave: VoidFunction;
  onCancel: VoidFunction;
};

// Component function for updating the number of boxes in the subscription
export default function NumberOfBoxes({ onCancel, onSave }: Props) {
  const updateSubscription = useUpdateSubscrption(); // Hook to update subscription
  const { totalPrice, totalSachets: quantity } = useContext(PurchaseContext); // Use context to get total price and quantity

  // Callback function to handle form submission
  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault(); // Prevent default form submission behavior

      // Update subscription with new total price and quantity
      updateSubscription.mutate(
        { totalPrice, quantity },
        {
          onSuccess: () => {
            onSave(); // Call onSave callback on success
          },
          onError: handleError, // Handle error on subscription update
        }
      );
    },
    [onSave, updateSubscription, quantity, totalPrice] // Dependencies for the callback
  );

  return (
    <form id="Number_of_boxes" onSubmit={handleSubmit}>
      <ProductCalc showButton={true} tw="px-2" />{" "}
      {/* Component to calculate product details */}
      {/* Button group for cancel and save actions */}
      <span tw="flex flex-row gap-6 place-content-around pb-6 lg:(pt-2) xl:(pt-2) hd:(pt-4) 2k:(pt-4) 4k:(pt-4)">
        {/* Cancel button */}
        <ActionButton
          title={"Cancel"}
          tw="w-1/2 border border-neutral-100 text-center text-black-100 text-base font-medium max-h-12 sm:(max-h-16 text-sm) lg:(max-h-16 text-lg) 2k:(px-[40px] py-[13.33px] text-lg) 4k:(px-[40px] py-[13.33px] text-xl)"
          onClick={onCancel} // Call onCancel callback on click
        />
        {/* Save button */}
        <button
          type="submit"
          tw="bg-[#1A202E] cursor-pointer flex items-center justify-center px-3 py-2 rounded-md transition-all hover:(text-white-100 bg-gray-400) w-1/2 text-center text-white-100 text-base font-medium max-h-12 sm:(max-h-16 text-sm) lg:(max-h-16 text-lg) 2k:(px-[40px] py-[13.33px] text-lg) 4k:(px-[40px] py-[13.33px] text-xl)"
        >
          {updateSubscription.isLoading ? <ButtonSpinner /> : "Save Changes"}{" "}
          {/* Show spinner if loading, else show "Save Changes" */}
        </button>
      </span>
    </form>
  );
}
