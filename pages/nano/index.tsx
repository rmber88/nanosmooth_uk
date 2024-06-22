import tw from "twin.macro";
import Navbar from "../../components/layouts/reusable/Navbar";
import Wrapper from "../../components/layouts/wrapper";
import { useRouter } from "next/router";
import NanoFruits from "./NanoFruits";
import NanoGreens from "./NanoGreens";
import ActionButton from "../../components/buttons/ActionButton";
import { Icon } from "@iconify/react";
import { useCart } from "../../context/CartContext";
import MobileNav from "../../components/layouts/reusable/MobileNav";
import { useEffect } from "react";
import SEOConfig from "../../components/SEO";

export default function Nano() {
  const router = useRouter();
  const { tab } = router.query;
  const { cartItems } = useCart();

  return (
    <main tw="relative w-full">
      <SEOConfig
        title={tab === "nano-fruits" || !tab ? "Nano fruits" : "Nano greens"}
      />

      <Navbar />
      <MobileNav />

      <Wrapper>
        {(tab === "nano-fruits" || !tab) && <NanoFruits />}
        {tab === "nano-greens" && <NanoGreens />}

        <ActionButton
          title="CART"
          tw="fixed top-[45%]  z-[999] -right-1 !text-sm !border-none shadow-2xl !rounded-l-full
          sm:(pl-5) md:(pl-7) lg:(pl-9) !font-bold flex-col-reverse  bg-white-100 sm:text-base md:text-base lg:text-lg lg:text-lg hd:text-xl 2k:text-2xl 4k:text-2xl"
          onClick={() => router.push("/cart")}
        >
          <Icon
            icon={"material-symbols-light:shopping-bag-outline"}
            width={32}
            height={32}
            tw={"sm:(h-[24px] w-[24px]) md:(h-[28px] w-[28px]) "}
          />

          <div tw="absolute top-0 left-0 w-5 h-5 rounded-full bg-red-600">
            <small tw="text-[#ffffff] ">{cartItems.length}</small>
          </div>
        </ActionButton>
      </Wrapper>
    </main>
  );
}
