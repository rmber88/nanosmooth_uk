import tw from "twin.macro";
import { ButtonHTMLAttributes } from "react";
import { ButtonSpinner } from "./buttonSpinner";

type Props = {
  type?: "submit" | "reset" | "button";
  title: string;
  isLoading?: boolean;
  onClick?: () => void;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function SubmitButton({
  title,
  type,
  onClick,
  isLoading,
  ...props
}: Props) {
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
      {...props}
      onClick={handleClick}
      type={type}
      title={title}
      aria-label={title}
      aria-labelledby={title}
      tw="text-2xl font-medium bg-blue-500 cursor-pointer w-full
        flex items-center justify-center px-3 py-4
        text-white-100 rounded-t-lg  border border-gray-800
        transition-all duration-200
        hover:(text-white-100 bg-black-100)
        disabled:(opacity-50 cursor-not-allowed)
      "
    >
      {isLoading ? ButtonSpinner : title}
    </button>
  );
}
