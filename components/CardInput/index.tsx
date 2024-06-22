import tw from "twin.macro";
import { ChangeEvent, useState } from "react";
import Image from "next/image";
import FormInput from "../FormInput";
import cardBg from "../public/images/cardBg.svg";
import masterCard from "../../public/icons/MasterCard.svg";
import visa from "../../public/icons/visa.svg";
import discover from "../../public/icons/discover.svg";
import FormSelect from "../FormSelect";
import { days, years } from "./_data";

export default function CardInput() {
  const [formState, setFormState] = useState({
    cardNumber: "",
    month: "",
    year: "",
    cvv: "",
  })

  return (
    <div tw="relative bg-black-10 py-14 px-8 flex flex-col gap-5 rounded-lg" className="radialGradient">
      {/* <Image src={cardBg} width={0} height={0} alt="" /> */}
      <div tw="w-full flex items-end justify-between gap-4 pt-14">
        <FormInput
          type="text"
          id={formState.cardNumber}
          value={formState.cardNumber}
          title="Card number"
          placeholder="0000 0000 0000 0000"
          maxLength={19}
          pattern="\d{4} \d{4} \d{4} \d{4}"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const formattedValue = e.target.value
              .replace(/\D/g, '')
              .replace(/(.{4})/g, '$1 ').trim();
            setFormState({ ...formState, cardNumber: formattedValue });
          }}
        />


        <div tw="w-[40%] flex items-center">
          <Image src={masterCard} width={0} height={0} alt="" />
          <Image src={visa} width={0} height={0} alt="" />
          <Image src={discover} width={0} height={0} alt="" />
        </div>
      </div>

      <div tw="flex items-center gap-5">
        <FormSelect
          label="Month"
          id={formState.month}
          options={days}
          value={formState.month}
          placeholder="00"
          onChange={(e:ChangeEvent<HTMLSelectElement>) => setFormState({...formState, month: e.target.value})}
        />
        <FormSelect
          label="Year"
          id={formState.year}
          options={years}
          value={formState.year}
          placeholder="00"
          onChange={(e:ChangeEvent<HTMLSelectElement>) => setFormState({...formState, year: e.target.value})}
        />

        <FormInput 
          type="password"
          title="CVV"
          id={formState.cvv}
          value={formState.cvv}
          maxLength={3}
          onChange={(e:ChangeEvent<HTMLInputElement>) => {
            const cvvValue = e.target.value.replace(/\D/g, '').slice(0, 3);
            setFormState({ ...formState, cvv: cvvValue });
          }}
          tw="w-[30%]"
        />
      </div>

    </div>
  )
}
