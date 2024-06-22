import { useState } from "react";
import tw from "twin.macro";
import Image from "next/image";
import image from "../../public/images/freeze-process.svg";
import comparison from "../../public/images/comparison.svg";
import bg from "../../public/images/freeze-bg.svg";
import verticallines from "../../public/icons/vertical_lines.svg";
import bgExpanded from "../../public/images/freeze-bg-1.svg";
import freezeBg2 from "../../public/images/freeze-bg-2.svg";
import benefits from "../../public/images/benefits.svg";
import Navbar from "../../components/layouts/reusable/Navbar";
import Hero from "../../components/FreezeDryComponents/Hero";
import MobileNav from "../../components/layouts/reusable/MobileNav";
import SEOConfig from "../../components/SEO";

export default function FreezeDryingProcess() {
  const [isBgExpanded, setIsBgExpanded] = useState(false);

  const handleBgClick = () => {
    setIsBgExpanded((prev) => !prev);
  };

  return (
    <main tw="w-full flex flex-col ">
      <div tw={"bg-gradient-to-b from-neutral-100 to-white-100"}>
        <SEOConfig title="Freeze drying process" />

        <Navbar />
        <MobileNav />
        <Hero />
        <div tw={"hidden lg:(block) "}>
          <Image
            src={image}
            width={0}
            height={0}
            alt=""
            tw="mx-auto w-full 2k:max-w-full 4k:max-w-[66.7%] pt-12 sm:(pt-2) md:(pt-2)"
          />
          <Image
            src={benefits}
            width={0}
            height={0}
            alt=""
            tw="mx-auto w-full 2k:max-w-full 4k:max-w-[66.7%]  transform -translate-y-24  sm:(-translate-y-12) md:(-translate-y-12) lg:(-translate-y-32) xl:(-translate-y-32) hd:(-translate-y-32) 2k:( -translate-y-44 ) 4k:(  -translate-y-44  )"
          />
        </div>
      </div>
      <div
        tw={
          "sm:(block) md:(block) lg:(hidden) xl:(hidden) hd:(hidden) 2k:(hidden) 4k:(hidden)"
        }
      >
        <Image
          src={isBgExpanded ? bgExpanded : bg}
          width={0}
          height={0}
          alt="Freeze drying background"
          onClick={handleBgClick}
          tw="mx-auto w-full 2k:max-w-full 4k:max-w-[66.7%] transform -translate-y-24 sm:(-translate-y-12) md:(-translate-y-12) lg:(-translate-y-32) xl:(-translate-y-32) hd:(-translate-y-32) 2k:( -translate-y-44 ) 4k:( -translate-y-44 ) cursor-pointer"
        />
        <Image
          src={freezeBg2}
          width={0}
          height={0}
          alt="Freeze drying background secondary"
          onClick={handleBgClick}
          tw="mx-auto w-full 2k:max-w-full 4k:max-w-[66.7%] transform -translate-y-24 sm:(-translate-y-12) md:(-translate-y-12) lg:(-translate-y-32) xl:(-translate-y-32) hd:(-translate-y-32) 2k:( -translate-y-44 ) 4k:( -translate-y-44 ) cursor-pointer"
        />
        <div tw={"flex flex-row mx-auto w-[60%] mb-20"}>
          <div
            tw={
              " justify-center items-center gap-1 translate-y-[-0.5rem] inline-flex"
            }
          >
            <Image src={verticallines} alt="vertical divider lines" />
          </div>

          <div
            tw={
              " pl-[10%] flex-col justify-start items-start md:(gap-[5.4rem]) gap-6 inline-flex"
            }
          >
            <div tw={" text-black-100 text-sm font-light leading-6 mt-0"}>
              For further information
            </div>
            <div tw={" text-black-100 text-sm font-light leading-6 mt-4"}>
              If you&apos;d like to collaborate If youd like to collaborate
            </div>
            <div tw={"self-stretch"}>
              <span tw={"text-black-100 text-sm font-semibold mt-4"}>
                Come through to our
                <br />
              </span>
              <span tw={"text-black-100 text-sm font-semibold underline"}>
                Knowledge Base
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
