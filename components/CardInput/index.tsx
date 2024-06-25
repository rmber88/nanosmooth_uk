// Import twin.macro for utility-first CSS styling using Tailwind CSS
import tw from "twin.macro";

// Import necessary hooks and types from React
import { ChangeEvent, useState } from "react";

// Import Image component from Next.js for optimized image handling
import Image from "next/image";

// Import custom FormInput component
import FormInput from "../FormInput";

// Import images for the card background and card logos
import cardBg from "../public/images/cardBg.svg";
import masterCard from "../../public/icons/MasterCard.svg";
import visa from "../../public/icons/visa.svg";
import discover from "../../public/icons/discover.svg";

// Import custom FormSelect component
import FormSelect from "../FormSelect";

// Import data for the select options
import { days, years } from "./_data";

// Define and export the CardInput component
export default function CardInput() {
  // Define the state for the form inputs using useState hook
  const [formState, setFormState] = useState({
    cardNumber: "",
    month: "",
    year: "",
    cvv: "",
  });

  return (
    <div
      // Apply Tailwind CSS styles using twin.macro
      tw="relative bg-black-10 py-14 px-8 flex flex-col gap-5 rounded-lg"
      // Apply additional class for radial gradient background
      className="radialGradient"
    >
      {/* Uncomment the Image component if you want to display the card background */}
      {/* <Image src={cardBg} width={0} height={0} alt="" /> */}

      <div
        // Apply Tailwind CSS styles for the card number input and card logos container
        tw="w-full flex items-end justify-between gap-4 pt-14"
      >
        {/* Card Number Input */}
        <FormInput
          type="text"
          id={formState.cardNumber}
          value={formState.cardNumber}
          title="Card number"
          placeholder="0000 0000 0000 0000"
          maxLength={19}
          pattern="\d{4} \d{4} \d{4} \d{4}"
          // Handle change event for card number input
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const formattedValue = e.target.value
              .replace(/\D/g, '') // Remove non-digit characters
              .replace(/(.{4})/g, '$1 ') // Insert space after every 4 digits
              .trim(); // Remove trailing spaces
            setFormState({ ...formState, cardNumber: formattedValue });
          }}
        />

        <div
          // Apply Tailwind CSS styles for the card logos container
          tw="w-[40%] flex items-center"
        >
          {/* Card Logos */}
          <Image src={masterCard} width={0} height={0} alt="" />
          <Image src={visa} width={0} height={0} alt="" />
          <Image src={discover} width={0} height={0} alt="" />
        </div>
      </div>

      <div
        // Apply Tailwind CSS styles for the expiry date and CVV inputs container
        tw="flex items-center gap-5"
      >
        {/* Month Select Input */}
        <FormSelect
          label="Month"
          id={formState.month}
          options={days}
          value={formState.month}
          placeholder="00"
          // Handle change event for month select input
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setFormState({ ...formState, month: e.target.value })
          }
        />

        {/* Year Select Input */}
        <FormSelect
          label="Year"
          id={formState.year}
          options={years}
          value={formState.year}
          placeholder="00"
          // Handle change event for year select input
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setFormState({ ...formState, year: e.target.value })
          }
        />

        {/* CVV Input */}
        <FormInput
          type="password"
          title="CVV"
          id={formState.cvv}
          value={formState.cvv}
          maxLength={3}
          // Handle change event for CVV input
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const cvvValue = e.target.value.replace(/\D/g, '').slice(0, 3); // Remove non-digit characters and limit to 3 digits
            setFormState({ ...formState, cvv: cvvValue });
          }}
          // Apply Tailwind CSS styles for the CVV input
          tw="w-[30%]"
        />
      </div>
    </div>
  );
}