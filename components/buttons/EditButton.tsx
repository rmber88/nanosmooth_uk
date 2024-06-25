// Import twin.macro for utility-first CSS styling using Tailwind CSS
import tw from "twin.macro";

// Import necessary types from React for defining prop types
import { HTMLAttributes } from "react";

// Define the Props type for EditButton component
type Props = {
  title: string; // The title prop, a string, for the button's title and aria attributes
} & HTMLAttributes<HTMLButtonElement>; // Include all HTML button attributes

// Define and export the EditButton component
export default function EditButton({ title, ...props }: Props) {
  return (
    <button
      {...props} // Spread any additional props onto the button element
      title={title} // Set the button's title attribute
      aria-label={title} // Set the aria-label attribute for accessibility
      aria-labelledby={title} // Set the aria-labelledby attribute for accessibility
      // Use twin.macro for applying Tailwind CSS classes with responsive and state-based styles
      tw="font-sans cursor-pointer w-max
        flex items-center justify-center 
        text-blue-500 underline 
        transition-all duration-200
        hover:(text-black-100)"
    >
      {title} // Render the title prop inside the button
    </button>
  );
}