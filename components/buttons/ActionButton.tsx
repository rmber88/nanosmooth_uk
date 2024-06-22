import tw from "twin.macro";
import { HTMLAttributes } from "react";

type Props = {
  title: string;
} & HTMLAttributes<HTMLButtonElement>;

export default function ActionButton({ title, children, ...props }: Props) {
  return (
    <button
      type="button"
      {...props}
      title={title}
      aria-label={title}
      aria-labelledby={title}
      tw="bg-transparent cursor-pointer 
        flex items-center justify-center px-3 py-2  
        text-blue-500 rounded-md border border-gray-300 
        transition-all duration-200
        hover:(text-white-100 bg-blue-500)
      "
    >
      {title}
      {children}
    </button>
  );
}
