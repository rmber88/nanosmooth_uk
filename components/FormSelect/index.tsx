import tw from "twin.macro";
// Import twin.macro for styling with Tailwind CSS.

import { HTMLAttributes } from "react";
// Import HTMLAttributes from React to extend standard HTML attributes.

import { ArrowDown2 } from "iconsax-react";
// Import the ArrowDown2 icon from the iconsax-react library.

type Option = {
  value: string;
  label: string;
};
// Define the Option type for the select options.

type FormSelectProps = {
  label: string;
  id: string;
  options: Option[];
  value: string;
  placeholder?: string;
  onClick?: () => void;
} & HTMLAttributes<HTMLSelectElement>;
// Define the prop types for the FormSelect component, including a label, id, options array, value, placeholder, and optional onClick handler, 
// and extend HTMLAttributes for a select element.

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  id,
  options = [],
  value,
  placeholder = "Please Select",
  onClick,
  ...props
}) => {
  // Define the FormSelect functional component, accepting props according to the FormSelectProps type.

  return (
    <div tw="relative flex flex-col items-start w-max">
      {/* Container div styled with twin.macro for relative positioning, flex layout, and maximum width. */}

      <label htmlFor={id} tw="font-mono text-blue-500 text-sm">{label}</label>
      {/* Label for the select element, styled with twin.macro for typography. */}

      <select
        name={id}
        id={id}
        value={value}
        disabled={options.length === 0}
        onClick={onClick}
        {...props}
        tw="bg-white-100 px-3 py-2 rounded-lg"
      >
        {/* Select element with conditional disabling based on the options length, styled with twin.macro for background, padding, and rounded corners. */}

        <option value="" tw="text-gray-100 font-mono">{placeholder}</option>
        {/* Placeholder option with styling. */}

        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            tw="text-gray-300"
          >
            {option.label}
          </option>
        ))}
        {/* Map over the options array to create an option element for each, with styling applied via twin.macro. */}
      </select>

      <ArrowDown2 size="24" color="#000000" variant="Bold" tw="absolute top-[50%] right-0"/>
      {/* ArrowDown2 icon positioned absolutely inside the container, aligned to the right and centered vertically. */}
    </div>
  );
};

export default FormSelect;
// Export the FormSelect component as the default export.