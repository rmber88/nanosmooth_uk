// Import tw from twin.macro for utility-first CSS styling using Tailwind CSS
import tw from "twin.macro";

// Import necessary types from React for defining prop types
import { HTMLAttributes, ReactNode } from "react";

// Define the Props type for CountButton component
type Props = {
  title: string; // The title prop, a string, for the button's title and aria attributes
  children: ReactNode; // The children prop, a ReactNode, for the button's content
} & HTMLAttributes<HTMLButtonElement>; // Include all HTML button attributes

// Define and export the CountButton component
export default function CountButton({ title, children, ...props }: Props) {
  return (
    <button
      {...props} // Spread any additional props onto the button element
      title={title} // Set the button's title attribute
      aria-label={title} // Set the aria-label attribute for accessibility
      type="button" // Set the type of the button to "button"
      aria-labelledby={title} // Set the aria-labelledby attribute for accessibility
      style={{ boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)" }} // Apply custom box-shadow styling
      // Use twin.macro for applying Tailwind CSS classes with additional responsive and state-based styles
      tw="flex items-center justify-center p-4 rounded-lg shadow-xl sm:(shadow-none) 
          bg-white-100 text-blue-500 cursor-pointer transition-all duration-200 
          border border-gray-100 hover:(text-white-100 bg-neutral-100 opacity-50) 
          rounded-[17px]"
    >
      {children} // Render the children prop inside the button
    </button>
  );
}