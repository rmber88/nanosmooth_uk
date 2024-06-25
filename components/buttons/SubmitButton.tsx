// Import twin.macro for utility-first CSS styling using Tailwind CSS
import tw from "twin.macro";

// Import necessary types from React for defining prop types
import { ButtonHTMLAttributes } from "react";

// Import the ButtonSpinner component for displaying a loading spinner
import { ButtonSpinner } from "./buttonSpinner";

// Define the Props type for SubmitButton component
type Props = {
  type?: "submit" | "reset" | "button"; // Optional prop to specify the button type
  title: string; // The title prop, a string, for the button's title and aria attributes
  isLoading?: boolean; // Optional prop to indicate loading state
  onClick?: () => void; // Optional onClick handler function
} & ButtonHTMLAttributes<HTMLButtonElement>; // Include all HTML button attributes

// Define and export the SubmitButton component
export default function SubmitButton({
  title,
  type,
  onClick,
  isLoading,
  ...props
}: Props) {
  // Define a handleClick function to handle button clicks
  const handleClick = () => {
    if (onClick) {
      // If onClick is provided, execute it
      onClick();
    } else {
      // If onClick is not provided, submit the form
      const form = document.querySelector("form");
      if (form) {
        form.dispatchEvent(new Event("submit"));
      }
    }
  };

  return (
    <button
      {...props} // Spread any additional props onto the button element
      onClick={handleClick} // Attach the handleClick function to the onClick event
      type={type} // Set the button's type attribute
      title={title} // Set the button's title attribute
      aria-label={title} // Set the aria-label attribute for accessibility
      aria-labelledby={title} // Set the aria-labelledby attribute for accessibility
      // Use twin.macro for applying Tailwind CSS classes with responsive and state-based styles
      tw="text-2xl font-medium bg-blue-500 cursor-pointer w-full
        flex items-center justify-center px-3 py-4
        text-white-100 rounded-t-lg border border-gray-800
        transition-all duration-200
        hover:(text-white-100 bg-black-100)
        disabled:(opacity-50 cursor-not-allowed)"
    >
      {isLoading ? ButtonSpinner : title} // Render ButtonSpinner if isLoading is true, otherwise render the title
    </button>
  );
}