import tw from "twin.macro";
import Portal from "../../portal";
import ModalWrapper from "../ModalWrapper";
import ModalBackDrop from "../ModalBackdrop";
import Typography from "../../typography";
import Link from "next/link";
import Image from "next/image";
import verticalBg from "../../../public/images/fruits-vertical-bg.png";
import horizontalBg from "../../../public/images/fruits-horizontal-bg.png";
import horizontalDivider from "../../../public/images/line-horizontal.png";
import verticalDivider from "../../../public/images/line-vertical.png";
import { Fragment } from "react";
import { ArrowRight2, CloseCircle } from "iconsax-react";

type Props = {
  isOpen: boolean;
  onClose: VoidFunction;
};

const elements = [
  <Fragment key={"frz1"}>
    H20 evaporated
    <br />
    gradually
  </Fragment>,
  <Fragment key={"frz2"}>
    Post molecules
    <br />
    remains undamaged
  </Fragment>,

  <Fragment key={"frz3"}>
    Nutritional value
    <br />
    is maintained
  </Fragment>,
];

export default function TheFreezeDryingProcess({ isOpen, onClose }: Props) {
  return (
    <Portal isOpen={isOpen}>
      <ModalWrapper tw="relative z-[5] overflow-hidden shadow-xl  py-6 px-6">
        <button
          tw=" absolute top-2 right-2 transition-all opacity-50 hover:(opacity-100)"
          onClick={onClose}
        >
          <CloseCircle tw="opacity-80 absolute top-4 right-4 transition-all" />
        </button>
        <ModalWrapper.container>
          <Typography.H3 tw="mt-6 mb-4 z-[5]">
            The Freeze-Drying process
          </Typography.H3>
          <Typography.P tw="relative font-semibold text-sm z-[5]">
            The natural process of drying from -25°C to room temperature
          </Typography.P>

          <ul tw="flex z-[5] flex-col gap-4 my-12 lg:(flex-row justify-between)">
            {elements.map((elem, index) => {
              const isLastElement = index === elements.length - 1;
              return (
                <li
                  tw="flex z-[5] items-center gap-2 flex-col lg:(flex-row)"
                  key={elem.key}
                >
                  <Typography.P tw="text-sm font-light text-center lg:(text-left)">
                    {elem}
                  </Typography.P>
                  {!isLastElement && (
                    <span className="arrow-divider">
                      <Image
                        src={verticalDivider}
                        tw="lg:(hidden)"
                        alt="divider vertical"
                      />
                      <Image
                        src={horizontalDivider}
                        tw="hidden lg:(block)"
                        alt="divider horizontal"
                      />
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          <div tw="  z-[5] absolute bottom-0 left-0 w-full pt-8 lg:(relative flex w-full pt-8 pb-8 justify-end )">
            <Link href="freeze-drying-process">
              <span tw="text-white-100 w-full justify-center text-center   py-4 bg-black-100 px-8 flex items-center  lg:(rounded-xl w-[fit-content])">
                Full Freeze-Drying Process
                <ArrowRight2 />
              </span>
            </Link>
          </div>
        </ModalWrapper.container>

        <figure tw="absolute bottom-[20%] lg:(left-0 bottom-0)">
          {/* Mobile */}
          <Image
            tw="relative  lg:(hidden)"
            src={verticalBg}
            alt="nanosmoothies"
          />

          {/* Web */}
          <Image
            tw="relative hidden lg:(block)"
            src={horizontalBg}
            alt="nanosmoothies"
          />
        </figure>
      </ModalWrapper>
      <ModalBackDrop />
    </Portal>
  );
}
