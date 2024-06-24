// Importing necessary libraries and components
import tw from "twin.macro"; // Library for using Tailwind CSS with styled-components
import { HTMLAttributes } from "react"; // React type definitions
import ActionButton from "../buttons/ActionButton"; // Custom button component

// Type definition for the ButtonGroupProps
type ButtonGroupProps = {
  primaryBtnTitle?: string; // Optional title for the primary button
  secondaryBtnTitle?: string; // Optional title for the secondary button
  onCancel: () => void; // Callback function for cancel action
  onSave?: (e: any) => void; // Optional callback function for save action
} & HTMLAttributes<HTMLButtonElement>; // Extending HTML button attributes

// ButtonGroup component definition
export default function ButtonGroup({
  title, // Unused prop, can be removed if not needed
  onCancel, // Function to handle cancel action
  onSave, // Function to handle save action
  primaryBtnTitle, // Title for the primary button
  secondaryBtnTitle, // Title for the secondary button
  children, // Children nodes, if any
  ...props // Spread operator to include any additional props
}: ButtonGroupProps) {
  return (
    // Container for the button group
    <span tw="flex flex-row gap-6 place-content-around pb-6 lg:(pt-2) xl:(pt-2) hd:(pt-4) 2k:(pt-4) 4k:(pt-4)">
      {/* Primary action button */}
      <ActionButton
        title={primaryBtnTitle ?? "Cancel"} // Default title is "Cancel" if not provided
        style={{
          color: "#1A202E", // Custom color for the text
        }}
        tw={
          "w-1/2 border border-neutral-100 text-center text-black-100 text-base font-medium max-h-12 sm:(max-h-16 text-sm) lg:(max-h-16 text-lg) 2k:(px-[40px] py-[13.33px] text-lg) 4k:(px-[40px] py-[13.33px] text-xl)"
        } // Tailwind CSS classes for styling
        onClick={onCancel} // Event handler for click action
      />
      {/* Secondary action button */}
      <ActionButton
        title={secondaryBtnTitle ?? "Save Changes"} // Default title is "Save Changes" if not provided
        style={{
          backgroundColor: "#1A202E", // Custom background color
          border: "none", // No border
        }}
        tw="w-1/2 text-center text-white-100 text-base font-medium max-h-12 sm:(max-h-16 text-sm) lg:(max-h-16 text-lg) 2k:(px-[40px] py-[13.33px] text-lg) 4k:(px-[40px] py-[13.33px] text-xl)" // Tailwind CSS classes for styling
        onClick={onSave} // Event handler for click action
      />
    </span>
  );
}