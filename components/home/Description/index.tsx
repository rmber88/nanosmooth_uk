import tw from "twin.macro";
import Wrapper from "../../layouts/wrapper";
import ProductDesc from "./ProductDesc";
import Image from "next/image";
import sachetLg from "../../../public/images/sachet-lg.svg";
import sachetSm from "../../../public/images/sachet-sm.png";
import SubscribeSteps from "./SubscribeSteps";
import { Fragment, useCallback, useState } from "react";
import { ArrowRight2, CloseCircle } from "iconsax-react";
import search from "../../../public/images/search.svg";
import { AnimatePresence, motion } from "framer-motion";
import NutritionInfo from "../../NutritionInfo";
import { darkberry } from "../../NutritionInfo/_data";

const motionConfig = (opp?: boolean) => ({
  initial: {
    opacity: 0,
    translateX: "-20%",
  },
  animate: {
    opacity: 1,
    translateX: 0,
  },
  exit: {
    opacity: 0,
    translateX: "-20%",
  },
});

export default function Description() {
  const [showInfo, setShowInfo] = useState(false);

  const toggleShowInfo = useCallback(() => {
    setShowInfo((p) => !p);
  }, []);

  return (
    <Wrapper tw="relative w-full flex items-center mx-auto flex-col lg:flex-row items-center justify-center my-14 sm:(translate-y-[-10vh])">
      <Fragment tw="2k:(w-[41%]) 4k:(w-[43%])">
        <AnimatePresence>
          {!showInfo && (
            <motion.div
              tw="absolute z-[10] left-[-22%] top-[4%] flex cursor-pointer sm:(left-[-17%] top-[60vh]) md:(left-[-9%] top-[40%]) lg:(top-[45%] left-[-5.5%]) xl:(left-[-4.8%]) hd:(left-[-5%]) 2k:(left-[-3.5%]) 4k:(left-[-3.5%])"
              className="group"
              onClick={toggleShowInfo}
              {...motionConfig()}
            >
              <span
                tw="flex gap-0 sm:(px-5 py-3) md:(px-6 py-4) xl:(px-6 py-5) lg:(px-6 py-5) hd:(px-6 py-8) 2k:(px-6 py-6) bg-white-100 rounded-tr-[10px] rounded-tl-[10px] rotate-90 uppercase !text-black-100/50 transition-all group-hover:(text-black-100/100) justify-center items-center"
                style={{ boxShadow: "0 0 40px rgba(0, 0, 0, 0.2)" }}
              >
                <div tw="flex items-center">
                  <div tw="mx-[4px] my-[4px] text-black-100 opacity-50 text-sm font-medium tracking-wide hd:(text-xl) 2k:(text-xl) 4k:(text-2xl)">
                    Nutrition&nbsp;Info
                  </div>
                  <Image
                    src={search}
                    tw="mx-[4px] my-[4px] h-[25px] w-[25px] sm:(w-[25px] h-[25px]) lg:(w-[25px] h-[25px]) 2k:(w-[26px] h-[26px]) 4k:(h-[26px] w-[26px]) -rotate-90"
                    alt="nanosmoothies box"
                  />
                </div>
              </span>

              <div tw="absolute right-12 sm:(transform translate-y-[18px]) hd:(transform translate-y-[40px] transform translate-x-[6px])  xl:(transform translate-x-[6px]) lg:(transform translate-x-[6px]) 2k:(transform translate-x-[-10px]) 4k:(transform translate-x-[-20px])">
                <ArrowRight2 tw="text-black-100 opacity-30 font-bold w-[24px] h-[24px] group-hover:opacity-100 sm:(w-[20px] h-[20px]) md:(w-[22px] h-[22px]) lg:(w-[26px] h-[26px]) 2k:(w-[26px] h-[26px])" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showInfo && (
            <motion.section
              tw="absolute max-w-[98vw] top-0 bg-white-100/30 z-[10] rounded-tr-3xl rounded-br-3xl backdrop-blur-xl py-8 px-[6%] left-0 md:(max-w-[48rem]) lg:(min-w-[45rem] px-[2%]) 2k:(min-w-[50rem] px-[2%]) 4k:(w-[55rem] px-[2%])"
              style={{ boxShadow: "0 0 40px rgba(0, 0, 0, 0.2)" }}
              {...motionConfig()}
            >
              <div tw="relative mb-4">
                <button
                  tw="absolute top-0 right-0 transition-all opacity-50 hover:opacity-100"
                  onClick={toggleShowInfo}
                >
                  <CloseCircle />
                </button>
                <NutritionInfo {...darkberry[0]} roundedSide="right" />
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <aside tw="w-full sm:hidden md:hidden lg:block">
          <Image
            src={sachetLg}
            tw="2k:(ml-[10%] w-[1154px] h-[1154px] scale-125 transform translate-y-[50px]) lg:(pl-[2%]) xl:(pl-[2%]) hd:(pl-[2%])  4k:(pl-[0%] w-[1154px] h-[1154px] scale-125)"
            alt="nanosmoothies sachet"
          />
        </aside>
      </Fragment>

      <section tw="w-full lg:(w-[36%]) xl:(w-[36%]) hd:(w-[36%]) 2k:(w-[59%]) 4k:(w-[57%])">
        <ProductDesc />
        <aside tw="w-full sm:block  md:block lg:hidden xl:hidden hd:hidden 2k:hidden 4k:hidden  mx-auto    md:(pl-[26%])">
          <Image src={sachetSm} alt="nanosmoothies sachet" />
        </aside>
        <SubscribeSteps />
      </section>
    </Wrapper>
  );
}
