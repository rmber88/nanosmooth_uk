import tw from "twin.macro";
import { HTMLAttributes, ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
} & HTMLAttributes<HTMLButtonElement>;

export default function CountButton({ title, children, ...props }: Props) {
  return (
    <button
      {...props}
      title={title}
      aria-label={title}
      type="button"
      aria-labelledby={title}
      style={{ boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)" }}
      tw="flex items-center justify-center p-4 rounded-lg shadow-xl sm:(shadow-none) bg-white-100 text-blue-500
        cursor-pointer transition-all duration-200 border border-gray-100
        hover:(text-white-100 bg-neutral-100 opacity-50) rounded-[17px]
      "
    >
      {children}
    </button>
  );
}
