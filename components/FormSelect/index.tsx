import tw from "twin.macro";
import { HTMLAttributes } from "react";
import { ArrowDown2 } from "iconsax-react";

type Option = {
  value: string;
  label: string;
};

type FormSelectProps = {
  label: string;
  id: string
  options: Option[];
  value: string;
  placeholder?: string;
  onClick?: () => void;
} & HTMLAttributes<HTMLSelectElement>;

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  id,
  options = [],
  value,
  placeholder = "Please Select",
  onClick,
  ...props
}) => {
  return (
    <div tw="relative flex flex-col items-start w-max">
      <label htmlFor={id} tw="font-mono text-blue-500 text-sm">{label}</label>
      <select
        name={id}
        id={id}
        value={value}
        disabled={options.length === 0}
        onClick={onClick}
        {...props}
        tw="bg-white-100 px-3 py-2 rounded-lg"
      >
        <option value="" tw="text-gray-100 font-mono">{placeholder}</option>
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            tw="text-gray-300"
          >
            {option.label}
          </option>
        ))}
      </select>
      <ArrowDown2 size="24" color="#000000" variant="Bold" tw="absolute top-[50%] right-0"/>
    </div>
  );
};

export default FormSelect;
