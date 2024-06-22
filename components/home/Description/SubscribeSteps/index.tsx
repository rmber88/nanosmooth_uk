import { useState } from "react";
import PriceSelect from "./PriceSelect";
import YourOrder from "./YourOrder";
import PaymentDetails from "./PaymentDetails";
import Success from "./Success";

const steps = [PriceSelect, YourOrder, PaymentDetails, Success];

export default function SubscribeSteps() {
  const [step, setStep] = useState(0);

  const handleStepChange = (index: number) => setStep(index);

  const SubscriptionSteps = steps[step];

  return (
    <section tw="w-full">
      <SubscriptionSteps step={step} setStep={handleStepChange} />
    </section>
  );
}
