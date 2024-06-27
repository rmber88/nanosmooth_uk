import tw from "twin.macro"; // twin.macro for using Tailwind CSS with styled components
import Wrapper from "../layouts/wrapper"; // Wrapper component for layout
import Typography from "../typography"; // Typography component for text styles
import { info } from "./_data"; // Data for the information sections
import Image from "next/image"; // Image component from Next.js for optimized images
import dots from "../../public/icons/dots.svg"; // Dots icon for styling
import freeze from "../../public/images/freeze.svg"; // Freeze image for the hero section
import pointer from "../../public/images/points.svg"; // Pointer image for the information sections
import circles from "../../public/images/circles.svg"; // Background circles image for styling

export default function Hero() {
  return (
    // Wrapper for the hero section with responsive padding and flex styles
    <Wrapper tw="md:(pt-[8%])lg:(pt-[4%]) hd:(pt-[2%])  w-full flex flex-col items-center justify-between ">
      <section tw="w-full flex flex-col lg:flex-row items-center justify-end lg:(mt-[0%])  ">
        {/* Text and image section */}
        <aside tw="2k:(mt-[3%])  w-full flex flex-col  sm:(gap-[10px]) md:(gap-[15px]) lg:(gap-[20px]) md:(gap-[20px])">
          <Typography.H1
            tw={
              "text-black-100 font-bold sm:(text-[30px] leading-snug pt-4) md:(text-[2.8rem] text-left leading-snug) lg:(text-[2.3rem] leading-snug) xl:(text-[2.9rem]) hd:(text-[3.2rem] leading-snug) 2k:(text-[5.3rem]) 4k:(text-[4.7rem]) leading-normal"
            }
          >
            Using state-of-the art
            <br />
            Freeze-Drying technology
          </Typography.H1>
          <Typography.H3
            tw={
              "sm:(text-[4.8vw] leading-snug ) mt-4 md:(text-[1.6rem] text-left leading-snug) lg:(text-[1.6rem] leading-snug ) xl:(text-[1.8rem] leading-snug) hd:(text-[2.5rem] leading-snug) 2k:(text-[3.2rem] ) 4k:(text-[3.2rem] ) leading-normal text-black-100 font-semibold"
            }
          >
            Our Freeze-Drying chambers open up <br />
            so many opportunities
          </Typography.H3>
        </aside>

        {/* Image of the freeze dryer */}
        <Image
          src={freeze}
          priority
          alt="Freeze Dryer"
          tw="2k:(w-[1009px] w-[100%]) md:(w-[80%] mx-auto) hd:(w-[50%] mx-auto) lg:(w-[45%] mx-auto) xl:(w-[50%]) mx-auto "
        />
      </section>

      {/* Information section with background image and information cards */}
      <section tw="relative w-full grid grid-cols-1 lg:grid-cols-3  items-start justify-center mb-8">
        <div tw="hidden md:block absolute top-0 left-0 w-full h-full z-[1]">
          {/* Background circles image */}
          <Image
            src={circles}
            layout="fill"
            objectFit="cover"
            alt=""
            tw="z-[1] text-neutral-200 transform translate-y-[0%] opacity-30"
          />
        </div>

        {/* Mapping through info data to create information cards */}
        {info.map((items, idx) => (
          <article
            key={idx}
            tw="flex flex-col items-center justify-center gap-3 z-[2]"
          >
            {/* Title of the information card */}
            <Typography.H4 tw="font-semibold text-black-100 relative w-max flex items-center justify-center pb-0 md:(text-4xl) lg:(text-2xl) xl:(text-xl) hd:(text-xl) 2k:(text-4xl) 4k:(text-4xl)">
              {items.title}
            </Typography.H4>

            {/* Pointer image */}
            <Image src={pointer} alt="" />
            <span tw="text-center font-light text-sm md:(text-2xl)   lg:(text-2xl) xl:(text-xl) hd:(text-xl) 2k:(text-xl) 4k:(text-xl) pb-2">
              {items.ex1}
            </span>
            {/* Dots image for separation */}
            <Image src={dots} width={0} height={0} alt="" tw="py-0" />
            <span tw="text-center font-light text-black-100 text-sm  sm:(pb-4) md:(text-2xl) lg:(text-2xl) xl:(text-xl) hd:(text-xl) 2k:(text-xl) 4k:(text-xl)  pb-6">
              {items.ex2}
            </span>
            {/* Dots image for separation */}
            <Image src={dots} width={0} height={0} alt="" tw="py-0" />
            <span tw="text-center font-light text-black-100 text-sm md:(text-2xl ) lg:(text-2xl) xl:(text-xl) hd:(text-xl) 2k:(text-xl) 4k:(text-xl)  pb-6">
              {items.ex3}
              {items.title === "Completely Natural" && (
                // Additional information for "Completely Natural" card
                <div tw="flex flex-col gap-2 text-center font-light text-black-100 text-sm md:(text-2xl) lg:(text-2xl) xl:(text-xl) hd:(text-xl) 2k:(text-xl) 4k:(text-xl) sm:(pb-4)">
                  <span>Molecules remain intact</span> ↓
                  <span>no need for preservatives</span>
                </div>
              )}
            </span>
          </article>
        ))}
      </section>
    </Wrapper>
  );
}