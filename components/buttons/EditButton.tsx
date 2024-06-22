import tw from "twin.macro";
import { HTMLAttributes } from "react";

type Props = {
  title: string
} & HTMLAttributes<HTMLButtonElement>

export default function EditButton({title, ...props}: Props) {
  return (
    <button {...props}
      title={title}
      aria-label={title}
      aria-labelledby={title}
      tw="font-sans cursor-pointer w-max
        flex items-center justify-center 
        text-blue-500 underline 
        transition-all duration-200
        hover:(text-black-100)
      "
    >
      {title}
    </button>
  )
}
