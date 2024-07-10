import { HTMLAttributes } from "react";
import tw from "twin.macro";

// Define the type for the props of the Wrapper component.
// It includes 'children' which is of type React.ReactNode and all the attributes of an HTML element.
type WrapperProps = {
  children: React.ReactNode;
} & HTMLAttributes<HTMLElement>;

// Define the Wrapper component which accepts children and other HTML attributes as props.
export default function Wrapper({ children, ...props }: WrapperProps) {
  return (
    // Render a div element with all the passed props and apply tailwind CSS styles using twin.macro.
    <div
      {...props}
      tw="px-[4%] mx-auto 2k:max-w-full 4k:max-w-[66.7%] sm:(mt-[0px])"
    >
      {children}
    </div>
  );
}
