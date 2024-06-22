import { InputHTMLAttributes, ReactNode, useId } from "react";
import tw from "twin.macro";

export type CheckBoxProps = {
  children?: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

export default function CheckBox({ children, ...inputProps }: CheckBoxProps) {
  const id = useId();
  return (
    <div id="formInput">
      <label tw="flex gap-3 items-center" htmlFor={id}>
        <input
          tw="cursor-pointer w-[min-content] checked:(text-black-100)"
          {...inputProps}
          type="checkbox"
          id={id}
        />
        {children}
      </label>
    </div>
  );
}
