import tw from "twin.macro";
import { HTMLAttributes } from "react";
import ActionButton from "../buttons/ActionButton";

type ButtonGroupProps = {
  primaryBtnTitle?: string;
  secondaryBtnTitle?: string;
  onCancel: () => void;
  onSave?: (e: any) => void;
} & HTMLAttributes<HTMLButtonElement>;

export default function ButtonGroup({
  title,
  onCancel,
  onSave,
  primaryBtnTitle,
  secondaryBtnTitle,
  children,
  ...props
}: ButtonGroupProps) {
  return (
    <span tw="flex flex-row gap-6 place-content-around pb-6 lg:(pt-2) xl:(pt-2) hd:(pt-4) 2k:(pt-4) 4k:(pt-4)">
      <ActionButton
        title={primaryBtnTitle ?? "Cancel"}
        style={{
          color: "#1A202E",
        }}
        tw={
          "w-1/2  border border-neutral-100 text-center text-black-100 text-base font-medium   max-h-12  sm:(max-h-16 text-sm) lg:(max-h-16 text-lg) 2k:(px-[40px] py-[13.33px] text-lg) 4k:(px-[40px] py-[13.33px] text-xl) "
        }
        onClick={onCancel}
      />
      <ActionButton
        title={secondaryBtnTitle ?? "Save Changes"}
        style={{
          backgroundColor: "#1A202E",
          border: "none",
        }}
        tw="w-1/2 text-center text-white-100 text-base font-medium  max-h-12  sm:(max-h-16 text-sm) lg:(max-h-16 text-lg) 2k:(px-[40px] py-[13.33px] text-lg) 4k:(px-[40px] py-[13.33px] text-xl)"
        onClick={onSave}
      />
    </span>
  );
}
