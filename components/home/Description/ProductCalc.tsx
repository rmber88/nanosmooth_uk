import tw from "twin.macro";
import { Add, Minus } from "iconsax-react";
import { HTMLAttributes, useContext, useEffect } from "react";
import CountButton from "../../buttons/CountButton";
import Typography from "../../typography";
import { PurchaseContext } from "../../../context/PurchaseContext";
import useUserSubscriptions from "../../../hooks/queries/subscriptions/useUserSubscriptions";
import { ButtonSpinner } from "../../buttons/buttonSpinner";

interface ProductCalcProps extends HTMLAttributes<HTMLDivElement> {
  showButton?: boolean;
  onSubmitSuccess?: () => void;
}

export default function ProductCalc({
  showButton,
  onSubmitSuccess,
  ...props
}: ProductCalcProps) {
  const userSubscription = useUserSubscriptions();
  const isLoading = userSubscription.isLoading;
  const data = userSubscription.data;

  const {
    count,
    incrementCount,
    decrementCount,
    pricePerSachet,
    totalPrice,
    totalSachets,
    setCount,
  } = useContext(PurchaseContext);

  const boxes = count;
  const sachets = totalSachets;
  const price = totalPrice;

  // setBoxes(data.quantity / 14);
  // setSachets(data.quantity);
  // setPrice(data.totalPrice);

  useEffect(() => {
    if (!data?.isActive) {
      return;
    }
    setCount(boxes);
  }, [boxes, setCount, data?.isActive]);

  return (
    <section
      tw="w-full flex items-center justify-between pt-8 pb-8 sm:(mx-auto) md:(w-[100%] mx-auto) lg:(px-2  mx-auto) xl:(px-2) hd:(px-2) 2k:(w-[840px] mx-auto) 4k:(w-[820px] mx-auto)"
      {...props}
    >
      <CountButton
        tw="sm:( !w-[45px] !h-[45px]) md:(!w-[65px] !h-[65px] ) lg:( !w-[50px] !h-[50px] ) xl:( !w-[60px] !h-[60px]) hd:( !w-[70px] !h-[70px]) 2k:( !w-[100px] !h-[100px]) 4k:( !w-[100px] !h-[100px])"
        title="Minus"
        onClick={decrementCount}
      >
        <Minus tw="text-black-100 font-bold sm:(scale-150)  lg:(!w-[20px] !h-[20px]) xl:(!w-[20px] !h-[20px]) hd:(!w-[24px] !h-[24px]) 2k:(w-[28px] h-[28px]) 4k:(w-[32px] h-[32px])" />
      </CountButton>

      <section tw="flex-1 flex flex-col items-end font-semibold  mr-8  sm:(mr-4 -translate-x-6 )md:(mr-8)  2k:(max-w-[185px]) 4k:(max-w-[230px])">
        <span tw="font-normal  ">
          <span tw="font-bold sm:(text-[13px]) md:(text-sm) lg:(text-base) xl:(text-base) hd:(text-lg) 2k:(text-2xl) 4k:(text-2xl)">
            {boxes}
          </span>
          <span
            tw={
              "sm:(text-[11px]) md:(text-sm) lg:(text-base) xl:(text-base) hd:(text-lg) 2k:(text-2xl) 4k:(text-2xl) pl-2"
            }
          >
            {boxes > 1 ? "boxes" : "box"}
          </span>
        </span>
        <small tw="!font-mono !text-gray-300 text-left sm:(text-[11px]) md:(text-[11px]) lg:(text-sm) xl:(text-base) hd:(text-base) 2k:(text-lg) 4k:(text-lg)">
          {sachets} sachets
        </small>
      </section>

      <Typography.P tw="text-black-100 font-normal sm:(text-sm -translate-x-4) md:(text-base) lg:(text-lg) xl:(text-lg) hd:(text-lg) 2k:(text-2xl) 4k:(text-2xl)">
        =
      </Typography.P>

      <section tw="flex-1 flex flex-col items-start  ml-8   sm:( ml-4 -translate-x-5) md:(ml-8)  2k:(max-w-[215px]) 4k:(max-w-[250px])">
        <div tw="flex items-end">
          <Typography.H4 tw="font-semibold sm:(text-[13px]) md:(text-lg) lg:(text-base) xl:(text-lg) hd:(text-xl) 2k:(text-2xl) 4k:(text-2xl)">
            £{price?.toFixed(2)}/
          </Typography.H4>
          <span tw="sm:(text-[11px]) md:(text-sm) lg:(text-base) xl:(text-base) hd:(text-lg) 2k:(text-xl) 4k:(text-xl)">
            month
          </span>
        </div>
        <small tw="font-mono text-gray-300 text-left sm:(text-[11px]) md:(text-[11px]) lg:(text-sm) xl:(text-base) hd:(text-base) 2k:(text-lg) 4k:(text-lg)">
          inc delivery
        </small>
        <small tw="font-mono text-gray-300 sm:(text-[11px]) md:(text-[11px]) lg:(text-sm) xl:(text-base) hd:(text-base) 2k:(text-lg) 4k:(text-lg)">
          ~£{pricePerSachet.toFixed(1)}0 per sachet
        </small>
      </section>

      <CountButton
        title="Add"
        tw="sm:( !w-[45px] !h-[45px])md:( !w-[65px] !h-[65px] ) lg:( !w-[50px] !h-[50px] ) xl:( !w-[60px] !h-[60px]) hd:( !w-[70px] !h-[70px]) 2k:( !w-[100px] !h-[100px]) 4k:( !w-[100px] !h-[100px])"
        onClick={incrementCount}
      >
        <Add tw="text-black-100 font-bold sm:(scale-150)  lg:(!w-[20px] !h-[20px]) xl:(!w-[20px] !h-[20px]) hd:(!w-[24px] !h-[24px]) 2k:(w-[28px] h-[28px]) 4k:(w-[32px] h-[32px])" />
      </CountButton>
    </section>
  );
}
