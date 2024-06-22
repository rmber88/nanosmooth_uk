import React from "react";
import tw from "twin.macro";
import Navbar from "../../components/layouts/reusable/Navbar";
import Wrapper from "../../components/layouts/wrapper";
import { useCart } from "../../context/CartContext";
import Typography from "../../components/typography";
import Image from "next/image";
import CountButton from "../../components/buttons/CountButton";
import { Add, Minus } from "iconsax-react";
import ActionButton from "../../components/buttons/ActionButton";
import { useRouter } from "next/router";
import MobileNav from "../../components/layouts/reusable/MobileNav";
import SEOConfig from "../../components/SEO";
import dotted from "public/icons/dotted.svg";

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    totalPrice,
  } = useCart();
  const router = useRouter();

  return (
    <main>
      <SEOConfig title="Cart" />
      <Navbar />
      <MobileNav />

      <div tw="pt-[12%] px-[8%] mb-14 w-full flex gap-7 flex-col lg:flex-row items-center ">
        <aside tw=" w-full flex flex-col items-start justify-start  gap-10 text-left">
          <Typography.H3 tw=" font-semibold">Your Cart</Typography.H3>
          <Typography.P tw="  ">
            One step away from completing your order
          </Typography.P>
          {cartItems.map((item, idx) => (
            <div key={idx} tw="flex items-start w-[100%]">
              <Image
                src={item.image}
                tw="w-[100px] h-[100px] sm:w-[130px] sm:h-[130px]"
                alt={item.name}
              />
              <div tw="ml-4 sm:ml-16 mt-5 flex flex-col justify-between gap-4">
                <Typography.P tw="flex flex-col items-center text-center">
                  {item.name}
                  <small tw="text-gray-300 mt-1 !text-sm font-mono">
                    100g fresh: 80g FD
                  </small>
                </Typography.P>
                <div tw="flex items-center gap-10">
                  <CountButton
                    title=""
                    tw="!p-2"
                    onClick={() => decreaseQuantity(item.id)}
                  >
                    <Minus />
                  </CountButton>
                  {item.quantity}
                  <CountButton
                    title=""
                    tw="!p-2"
                    onClick={() => increaseQuantity(item.id)}
                  >
                    <Add />
                  </CountButton>
                </div>
                <span
                  tw="text-blue-300 underline text-sm cursor-pointer"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove from cart
                </span>
              </div>
              <Typography.H4 tw="ml-auto sm:(hidden) md:(block) ">
                £{item.pricePerItem}
              </Typography.H4>
            </div>
          ))}
        </aside>

        <section tw=" md:(w-[20%]) lg:(w-[20%]) xl:(w-[35%]) hd:(w-[35%]) 2k:(w-[35%]) 4k:(w-[35%]) w-full  flex "></section>

        <aside tw="w-full  flex flex-col items-start justify-center gap-10  ">
          <div tw="flex items-center justify-between w-full lg:(pt-[30%])">
            <Typography.P tw="!text-blue-500 !font-bold">Subtotal</Typography.P>
            <div tw="flex-grow mx-4">
              <Image src={dotted} alt="dotted" tw="w-full" />
            </div>
            <Typography.P tw="!text-blue-500 !font-bold">
              £{totalPrice}
            </Typography.P>
          </div>

          <div tw="flex items-center justify-between w-full">
            <Typography.P tw="!text-blue-500">Delivery (UK)</Typography.P>
            <div tw="flex-grow mx-4">
              <Image src={dotted} alt="dotted" tw="w-full" />
            </div>
            <Typography.P tw="!text-blue-500">Free</Typography.P>
          </div>

          <div tw="flex items-center justify-between w-full">
            <Typography.P tw="!text-blue-500 !font-bold">Total</Typography.P>
            <div tw="flex-grow mx-4">
              <Image src={dotted} alt="dotted" tw="w-full" />
            </div>
            <Typography.P tw="!text-blue-500 !font-bold">
              £{totalPrice}
            </Typography.P>
          </div>

          {!!cartItems.length && (
            <ActionButton
              title="Proceed to Checkout →"
              tw="bg-black-100 text-white-100 w-[100%] mt-[5%]"
              onClick={() => router.push("/checkout")}
            />
          )}
        </aside>
      </div>
    </main>
  );
}
