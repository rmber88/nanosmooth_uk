import tw from "twin.macro";
// Import twin.macro for styling with Tailwind CSS.

import {
  HTMLAttributes,
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  MouseEvent,
  useState,
} from "react";
// Import necessary hooks and types from React.

type FormInputProps = {
  id: string;
  type: HTMLInputTypeAttribute;
  title: string;
  pattern?: string;
  error?: string;
  disabled?: boolean;
};
// Define the prop types for the FormInput component. These include standard input attributes and additional props like 'title', 'error', and 'disabled'.

export default function FormInput({
  id,
  type,
  title,
  value,
  placeholder,
  maxLength,
  pattern,
  onChange,
  error,
  disabled,
  ...props
}: FormInputProps & InputHTMLAttributes<HTMLInputElement>) {
  // Define the FormInput component, accepting props according to the FormInputProps type and additional input attributes.

  const [showPassword, setShowPassword] = useState<boolean>(false);
  // State to toggle password visibility.

  const [formState, setFormState] = useState({
    [id]: value,
  });
  // State to manage the value of the input field.

  const togglePasswordVisibility = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };
  // Function to toggle the visibility of the password field.

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  // Function to handle changes in the input field and update formState.

  return (
    <div tw="relative w-full flex flex-col items-start">
      {/* Container div styled with twin.macro for relative positioning, full width, and flex layout. */}

      <label
        htmlFor={id}
        tw="relative text-blue-500 opacity-40 text-sm font-light text-gray-800"
      >
        {title}
      </label>
      {/* Label for the input field, styled with twin.macro for text properties. */}

      <input
        type={type === "password" && showPassword ? "text" : type}
        id={id}
        name={id}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleChange(e);
          if (onChange) {
            onChange(e);
          }
        }}
        tw="relative w-full bg-white-100 text-gray-800 font-light border border-black-10 rounded-lg px-1 py-[16px] sm:(py-[8px] text-sm) md:(text-sm) focus:(outline-none shadow-none)"
        placeholder={placeholder}
        maxLength={maxLength}
        pattern={pattern}
        disabled={disabled}
        style={{
          backgroundColor: disabled ? "lightgray" : "white",
        }}
        {...props}
      />
      {/* Input field with conditional type for password visibility, styled with twin.macro for various properties, and spreading additional props. */}

      {!!error && <span tw="text-red-700 mt-2 text-sm font-mono">{error}</span>}
      {/* Conditionally render an error message if the error prop is provided, styled with twin.macro. */}
    </div>
  );
}