import tw from "twin.macro";
import Typography from "../../../typography";
import { Icon } from "@iconify/react";
import Image from "next/image";
import tiktok from "../../../../public/icons/tiktok.svg";
import { Facebook, Instagram } from "iconsax-react";

export default function Success() {
  return (
    <section tw="w-full flex flex-col gap-3 mt-12 border-t border-gray-100 py-5">
      <Typography.H3>
        Your order is complete
      </Typography.H3>

      <Typography.P tw="font-semibold">
        Order number is: 215678
      </Typography.P>

      <Typography.P>
        You will receive an email confirmation shortly
      </Typography.P>

      <Icon icon={"mingcute:check-fill"} width={98} height={98} color="#884D88" tw="mx-auto my-14" />

      <div tw="w-full mx-auto flex flex-col gap-5">
        <span tw="text-center" >Share with friends</span>

        <span tw="w-full flex items-center justify-center gap-3 mx-auto">
          <Instagram />
          <Icon icon={"ri:facebook-fill"} width={24} height={24} />
          <Image src={tiktok} width={0} height={0} alt="" />
        </span>
      </div>
    </section>
  )
}
