import { useState, FormEvent } from "react";
import { HTMLAttributes } from "react";
import tw from "twin.macro";
import Typography from "../typography";
import { Icon } from "@iconify/react";
import ButtonGroup from "../buttonGroup";

type ClickRevealProps = {
  title: string;
  defaultValue?: string;
  type?: string;
  pattern?: string;
  maxLength?: number;
  willEdit?: boolean;
  showButtons?: boolean;
  isExpanded: boolean;
  onExpand: (data?: any) => void;
  onSave?: (data: string) => void;
  submitTrigger?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export default function ClickReveal({
  title,
  defaultValue,
  type,
  pattern,
  maxLength,
  showButtons = true,
  willEdit = false,
  isExpanded,
  onExpand,
  onSave,
  submitTrigger,
  ...props
}: ClickRevealProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave?.(title);
  };

  return (
    <section tw={"flex flex-col py-[4px] sm:(py-[2px]) md:(py-[2px])  "}>
      <div
        tw="w-full mx-auto flex flex-col py-[12px] 2k:(py-[26px]) 4k:(py-[26px]) border-b border-neutral-100 justify-start items-center inline-flex"
        {...props}
      >
        <div
          tw="w-full flex items-center justify-between cursor-pointer"
          onClick={onExpand}
        >
          <Typography.P tw={"text-black-100 text-sm font-light 4k:text-lg"}>
            {title}
          </Typography.P>
          <Icon
            icon={isExpanded ? "mdi:minus" : "mdi:plus"}
            tw={
              " hd:(w-[34px] h-[34px]) xl:(w-[34px] h-[34px]) 2k:(w-[34px] h-[34px]) 4k:(w-[36px] h-[36px])"
            }
            width={32}
            height={32}
          />
        </div>
        {isExpanded && (
          <div
            tw="w-full overflow-hidden transition-all duration-300 ease-in-out"
            style={{ maxHeight: isExpanded ? "100vh" : "0" }}
          >
            {!willEdit && <>{props.children}</>}
            {showButtons && (
              <ButtonGroup onCancel={onExpand} onSave={handleSubmit} />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
