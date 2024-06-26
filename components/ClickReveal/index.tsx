import { useState, FormEvent } from "react";
import { HTMLAttributes } from "react";
// Import necessary hooks and types from React.

import tw from "twin.macro";
// Import twin.macro for styling with Tailwind CSS.

import Typography from "../typography";
import { Icon } from "@iconify/react";
import ButtonGroup from "../buttonGroup";
// Import custom components and Iconify for icons.

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
// Define the prop types for the ClickReveal component, including various optional and required props, and extend HTMLAttributes for a div element.

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
  // Define the ClickReveal component, accepting props according to the ClickRevealProps type.

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Prevent the default form submission behavior.

    onSave?.(title);
    // If the onSave prop is provided, call it with the title as the argument.
  };

  return (
    <section tw={"flex flex-col py-[4px] sm:(py-[2px]) md:(py-[2px])  "}>
      // Section element styled with twin.macro for responsive padding.

      <div
        tw="w-full mx-auto flex flex-col py-[12px] 2k:(py-[26px]) 4k:(py-[26px]) border-b border-neutral-100 justify-start items-center inline-flex"
        {...props}
      >
        // Container div styled with twin.macro for padding, border, and flex properties, and spreading additional props onto it.

        <div
          tw="w-full flex items-center justify-between cursor-pointer"
          onClick={onExpand}
        >
          // Inner div styled for full width, flex alignment, and cursor change on hover, with an onClick event to trigger the onExpand function.

          <Typography.P tw={"text-black-100 text-sm font-light 4k:text-lg"}>
            {title}
          </Typography.P>
          // Typography component to display the title, styled with twin.macro for text properties.

          <Icon
            icon={isExpanded ? "mdi:minus" : "mdi:plus"}
            tw={
              " hd:(w-[34px] h-[34px]) xl:(w-[34px] h-[34px]) 2k:(w-[34px] h-[34px]) 4k:(w-[36px] h-[36px])"
            }
            width={32}
            height={32}
          />
          // Icon component from @iconify/react to display a plus or minus icon based on the isExpanded state, styled with twin.macro.
        </div>

        {isExpanded && (
          <div
            tw="w-full overflow-hidden transition-all duration-300 ease-in-out"
            style={{ maxHeight: isExpanded ? "100vh" : "0" }}
          >
            // Conditional rendering of a div that appears if isExpanded is true. It includes styles for smooth transition and overflow handling.

            {!willEdit && <>{props.children}</>}
            // Conditionally render children if willEdit is false.

            {showButtons && (
              <ButtonGroup onCancel={onExpand} onSave={handleSubmit} />
            )}
            // Conditionally render ButtonGroup component if showButtons is true, passing onExpand to onCancel and handleSubmit to onSave.
          </div>
        )}
      </div>
    </section>
  );
}