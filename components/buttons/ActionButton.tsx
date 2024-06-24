// Importing necessary libraries
import tw from "twin.macro"; // Library for using Tailwind CSS with styled-components
import { HTMLAttributes } from "react"; // React type definitions

// Type definition for the Props
type Props = {
  title: string; // Title for the button, required
} & HTMLAttributes<HTMLButtonElement>; // Extending HTML button attributes

// ActionButton component definition
export default function ActionButton({ title, children, ...props }: Props) {
  return (
    // Button element with various props and styles
    <button
      type="button" // Setting the button type to "button"
      {...props} // Spread operator to include any additional props
      title={title} // Setting the title attribute to the provided title
      aria-label={title} // Setting the aria-label attribute for accessibility
      aria-labelledby={title} // Setting the aria-labelledby attribute for accessibility
      // Applying Tailwind CSS styles using twin.macro
      tw="bg-transparent cursor-pointer 
        flex items-center justify-center px-3 py-2  
        text-blue-500 rounded-md border border-gray-300 
        transition-all duration-200
        hover:(text-white-100 bg-blue-500)
      "
    >
      {title} {/* Displaying the button title */}
      {children} {/* Rendering any children passed to the button */}
    </button>
  );
}