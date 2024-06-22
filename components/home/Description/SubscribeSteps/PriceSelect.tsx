import tw from "twin.macro";
import ProductCalc from "../ProductCalc";
import Image from "next/image";
import box from "../../../../public/images/box1.svg";
import SubmitButton from "../../../buttons/SubmitButton";
import Typography from "../../../typography";

import letter from "../../../../public/icons/letter.svg";
import clock from "../../../../public/icons/clock.svg";
import getTwoDaysFromToday from "../../../../utils/getTwoDaysFromToday";
import { Fragment, useCallback, useEffect, useState } from "react";
import useCurrentUser from "../../../../hooks/queries/auth/useCurrentUser";
import useCreateSubscription from "../../../../hooks/mutations/subscriptions/useCreateSubscription";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firebaseApp } from "../../../../firebase/config";
import { InfoCircle } from "iconsax-react";
import ActionButton from "../../../buttons/ActionButton";
import { useRouter } from "next/router";
import useUserSubscriptions from "../../../../hooks/queries/subscriptions/useUserSubscriptions";

type Props = {
  step: number;
  setStep: (step: number) => void;
};

export default function PriceSelect({ step, setStep }: Props) {
  const auth = getAuth(firebaseApp);
  const router = useRouter();

  const estDate = getTwoDaysFromToday();
  const [date, day] = estDate.split(" ");
  const userSubscription = useUserSubscriptions();

  const currentUser = useCurrentUser();
  const [isAuth, setIsAuth] = useState(currentUser);
  const cantResubscribe = !!isAuth && !!userSubscription.data?.isActive;

  // Managing Auth State
  useEffect(() => {
    onAuthStateChanged(auth, (e) => {
      setIsAuth(e);
    });
  }, [auth]);

  const handleContinue = useCallback(() => {
    // move to next step
    setStep(step + 1);
  }, [setStep, step]);

  return (
    <Fragment>
      {cantResubscribe ? (
        <section tw="bg-gray-50 p-5 rounded-xl">
          <InfoCircle />

          <div tw="my-4">
            <Typography.H4>You already have a subscription</Typography.H4>
            <Typography.P isGrey>
              Hi, you are currently subscribed. Want to modify the quantity? Tap
              &quot;Manage subscription&quot; to manage your subscription{" "}
            </Typography.P>
          </div>
          <ActionButton
            title="Manage subscription"
            onClick={() => router.push("/membership")}
          />
        </section>
      ) : (
        <section tw="w-full flex flex-col gap-5">
          <div tw={"sm:(hidden) md:(hidden) lg:(block)"}>
            <Image
              src={box}
              tw="mx-auto items-center xl:w-[580px] xl:h-[240px]"
              alt="nanosmoothies box"
            />
          </div>

          <ProductCalc />

          <div
            tw={"w-[75%] mx-auto mb-4 mt-2"}
            style={{
              border: "1.32px rgba(26, 32, 46, 0.10) solid",
            }}
          ></div>

          <div tw="flex items-center mx-auto gap-[2rem] sm:(gap-[0.5rem]) md:(gap-[0.5rem])">
            <Typography.P tw="sm:(text-sm) md:(text-base) lg:(text-base) xl:(text-base) hd:(text-xl) 2k:(text-2xl) 4k:(text-2xl)">
              *Estimated Arrival
            </Typography.P>
            <div tw="flex space-x-0 items-center sm:(text-xs) md:(text-sm) lg:(text-sm) xl:(text-lg) hd:(text-lg) 2k:(text-xl) 4k:(text-xl)">
              <Typography.H4 tw="p-1 m-0 font-semibold sm:(text-xl) md:(text-xl) lg:(text-base) xl:(text-xl) hd:(text-2xl) 2k:(text-3xl) 4k:(text-3xl)">
                {day}
              </Typography.H4>
              <Typography.P tw="p-1 m-0 sm:(text-sm) md:(text-sm) lg:(text-base) xl:(text-lg) hd:(text-lg) 2k:(text-xl) 4k:(text-xl)">
                {date}
              </Typography.P>
            </div>
          </div>

          <div tw="flex items-center mx-auto gap-[5rem]   sm:(gap-[2rem]) md:(gap-[2rem]) ">
            <Typography.P
              isGrey
              tw="flex items-center gap-2 font-mono sm:(text-[11px]) md:(text-sm) lg:(text-xs) xl:(text-lg) hd:(text-lg) 2k:(text-xl) 4k:(text-xl)"
            >
              <Image src={letter} alt="letter" />
              Letterbox delivery
            </Typography.P>
            <Typography.P
              isGrey
              tw="flex items-center gap-2 font-mono sm:(text-xs) md:(text-sm) lg:(text-xs) xl:(text-lg) hd:(text-lg) 2k:(text-xl) 4k:(text-xl)"
            >
              <Image src={clock} alt="cancel anytime" />
              Cancel Anytime
            </Typography.P>
          </div>

          <SubmitButton
            title="Subscribe"
            onClick={handleContinue}
            tw="mt-5 py-7 mx-auto mx-4 mx-auto sm:(py-4) md:(py-6 ) lg:(py-4)"
          />
        </section>
      )}
    </Fragment>
  );
}
