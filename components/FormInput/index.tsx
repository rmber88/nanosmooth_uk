import tw from "twin.macro";
import {
  HTMLAttributes,
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  MouseEvent,
  useState,
} from "react";

type FormInputProps = {
  id: string;
  type: HTMLInputTypeAttribute;
  title: string;
  pattern?: string;
  error?: string;
  disabled?: boolean;
};

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
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formState, setFormState] = useState({
    [id]: value,
  });

  const togglePasswordVisibility = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div tw="relative w-full flex flex-col items-start">
      <label
        htmlFor={id}
        tw="relative text-blue-500 opacity-40 text-sm font-light text-gray-800"
      >
        {title}
      </label>

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
      {!!error && <span tw="text-red-700 mt-2 text-sm font-mono">{error}</span>}
    </div>
  );
}
