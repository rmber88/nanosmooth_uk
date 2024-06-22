import tw from "twin.macro";
import Typography from "../../components/typography";
import NanoDisplay from "../../components/nanodisplay";
import { useRouter } from "next/router";

export default function NanoGreens() {
  const router = useRouter();

  return (
    <div tw=" sm:() md:(pt-20) lg:(pt-16) xl:(pt-8) hd:(pt-8) 2k:(pt-6) 4k:(pt-6) ">
      <header tw=" flex  sm:(pt-[15%] pb-[4%] px-[10%] w-auto )  md:(pt-[0%] pb-[4%] px-[w-1/2] ) lg:(pt-[12%] pb-[4%]  px-[8%]) xl:(pt-[12%]  pb-[6%] px-[8%]) hd:(pt-[12%] pb-[6%] px-[8%]) 2k:(pt-[12%] pb-[4%] px-[8%]) 4k:(pt-[16%] pb-[4%] px-[10%]) items-end gap-3">
        <Typography.H1 tw="relative font-normal sm:(text-5xl) md:(text-5xl) lg:(text-5xl) xl:(text-6xl) hd:(text-7xl) 2k:(text-7xl pl-[6%]) 4k:(text-7xl)">
          <span tw="font-semibold">nano</span>greens
          <span>®</span>
        </Typography.H1>

        <Typography.P
          isGrey
          tw="!font-mono sm:(hidden) md:(block) lg:(pt-1 text-base) xl:(pt-1 text-xl) hd:(pt-1 text-xl) 2k:( pt-3 text-xl) 4k:(pt-3 text-xl) "
        >
          - natural freeze-dried fruit
        </Typography.P>
      </header>

      <NanoDisplay />
    </div>
  );
}
