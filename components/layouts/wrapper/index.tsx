import { HTMLAttributes } from "react";
import tw from "twin.macro";

type WrapperProps = {
  children: React.ReactNode;
} & HTMLAttributes<HTMLElement>;

export default function Wrapper({ children, ...props }: WrapperProps) {
  return (
    <div
      {...props}
      tw="px-[4%] mx-auto 2k:max-w-full 4k:max-w-[66.7%] sm:(mt-[0px]) "
    >
      {children}
    </div>
  );
}
