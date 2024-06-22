/* eslint-disable react/no-unknown-property */
import tw from "twin.macro";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { useRouter } from "next/router";
import { nanoItems } from "./_data";
import { darkberry } from "../NutritionInfo/_data";
import darkBerryImg from "../../public/nano/dark-berry.svg";
import NutritionInfo from "../NutritionInfo";
import { useCart } from "../../context/CartContext";
import CountButton from "../buttons/CountButton";
import pound from "../../public/icons/pound.svg";
import rightArrow from "../../public/icons/arrow-right.svg";
import { Add, CloseCircle, Minus } from "iconsax-react";
import Typography from "../typography";
import SubmitButton from "../buttons/SubmitButton";

import "swiper/css";
import "swiper/css/navigation";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

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

export default function NanoDisplay() {
  const [activeImage, setActiveImage] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const router = useRouter();
    const [showInfo, setShowInfo] = useState(false);
    const [slidesPerView, setSlidesPerView] = useState<number>(3);
    const { addToCart, increaseQuantity, decreaseQuantity } = useCart();

    const swiper = useSwiper();


  const toggleShowInfo = useCallback(() => {
    setShowInfo((p) => !p);
  }, []);

  useEffect(() => {
    const activeImageParam = Number(router.query.activeImage);
    if (!isNaN(activeImageParam)) {
      setActiveImage(activeImageParam);
    }
  }, [router.query.activeImage]);

  useEffect(() => {
    setQuantity(1);
  }, [activeImage]);

  useEffect(() => {
    const handleResize = () => {
      setSlidesPerView(window.innerWidth <= 699 ? 1 : 3);
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    console.log("swiper instance:", swiper);
  }, [swiper]);
  const handleImageClick = (idx: number, tab: string) => {
    console.log("handleImageClick idx:", idx);
    if (swiper) {
      swiper.slideTo(idx);
    }

    setActiveImage(idx);
  };

  const handleAddToCart = () => {
    const itemToAdd = nanoItems[activeImage];
    addToCart({
      id: itemToAdd.title,
      image: itemToAdd.image,
      name: itemToAdd.title,
      pricePerItem: itemToAdd.price * quantity,
      quantity,
    });
    toast.success("Item added to cart");
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
    increaseQuantity(nanoItems[activeImage].title);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
      decreaseQuantity(nanoItems[activeImage].title);
    }
  };

  const handleSlideChange = (swiper: any) => {
    setActiveImage(swiper.realIndex);
  };

  return (
    <section tw=" w-full flex flex-col lg:flex-row items-center lg:items-start justify-between  mb-40">
      <section tw="md:(w-[1%]) lg:(w-[1%]) xl:(w-[5%]) hd:(w-[5%]) 2k:(w-[15%]) 4k:(w-[5%]) w-full  flex flex-col items-center justify-center gap-10"></section>
      <section tw=" md:(w-[100%]) lg:(w-[50%]) xl:(w-[55%]) hd:(w-[55%]) 2k:(w-[50%]) 4k:(w-[55%]) w-full  flex flex-col items-center justify-center gap-0">
        {nanoItems[activeImage] && (
          <Image
            src={nanoItems[activeImage].image}
            priority={true}
            fetchPriority="high"
            tw={
              "sm:(hidden) md:(block) lg:(block) xl:(block) hd:(block) 2k:(block) 4k:(block) translate-x-[2%]"
            }
            alt={nanoItems[activeImage].title}
          />
        )}

        <Swiper
          modules={[Navigation]}
          centeredSlides={true}
          slidesPerView={slidesPerView}
          spaceBetween={30}
          loop={true}
          onSlideChange={handleSlideChange}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          tw="w-[90%] mx-auto flex items-center text-black-100"
        >
          {nanoItems.map((item, idx) => (
            <SwiperSlide key={idx}>
              <div tw="flex flex-col items-center justify-center h-full">
                <Image
                  src={item.image}
                  tw="mx-auto w-[120px] h-[120px] sm:(w-[320px] h-[320px]) hd:(w-[200px] h-[200px]) 2k:(w-[200px] h-[200px]) 4k:(w-[200px] h-[200px]) "
                  alt={item.title}
                  fetchPriority="high"
                />
                <div tw="flex flex-col items-center justify-center h-full">
                  <div tw="flex flex-col items-center justify-center mx-auto  gap-2">
                    <Typography.H4 tw="font-normal font-sans capitalize text-zinc-900 sm:text-sm md:text-base lg:text-lg lg:text-lg hd:text-xl 2k:text-xl 4k:text-xl font-semibold  leading-normal">
                      {item.title}
                    </Typography.H4>
                    <Typography.P tw="text-left text-neutral-900 sm:text-xs md:text-sm lg:text-base hd:text-base 2k:text-base 4k:text-base font-mono">
                      {item.freshSize}: <br />
                      {item.pouch}
                    </Typography.P>

                    <span tw="text-center font-semibold  text-zinc-900  sm:text-sm md:text-base lg:text-base lg:text-base hd:text-base 2k:text-lg 4k:text-lg">
                      <div tw="flex items-center">
                        <Image src={pound} alt="pound sign" tw={"mr-0.5"} />

                        {item.price}
                      </div>
                    </span>
                    <small tw="font-mono text-neutral-900 text-left sm:text-[11.2px] md:text-[15px] lg:text-[15px] lg:text-[15px] hd:text-[15px] 2k:text-[16px] 4k:text-[16px] ">
                      inc. delivery
                    </small>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div
            className="swiper-button-next"
            tw="text-black-100 transform sm:(scale-50) md:(scale-50) lg:(scale-50) xl:(scale-50) hd:(scale-50) 2k:(scale-50) 4k:(scale-50) translate-x-[50%] translate-y-[-100%]"
          ></div>
          <div
            className="swiper-button-prev"
            tw="text-black-100 transform sm:(scale-50) md:(scale-50) lg:(scale-50) xl:(scale-50) hd:(scale-50) 2k:(scale-50) 4k:(scale-50) translate-x-[-50%] translate-y-[-100%]"
          ></div>
        </Swiper>
      </section>

      <div tw=" sm:(flex) md:(hidden) lg:(hidden) xl:(hidden) hd:(hidden) 2k:(hidden) 4k:(hidden) w-full flex flex-col lg:flex-row items-center gap-8 mt-[50px] sm:(mt-[0px])   pt-14 ">
        <div tw="flex items-center gap-8 place-content-between">
          <CountButton
            tw={"mr-4"}
            title="minus"
            onClick={handleDecreaseQuantity}
          >
            <Minus />
          </CountButton>
          <span tw="flex flex-col items-center justify-center place-content-between">
            <Typography.P tw="text-center  text-zinc-900 sm:text-sm md:text-sm lg:text-lg lg:text-lg hd:text-lg 2k:text-lg 4k:text-lg  font-medium ">
              <span>
                Qty: <strong tw={"ml-1"}> {quantity}</strong>
              </span>
            </Typography.P>
          </span>
          <CountButton tw={"ml-4"} title="add" onClick={handleIncreaseQuantity}>
            <Add />
          </CountButton>
        </div>

        <div tw="flex items-center mx-auto">
          {nanoItems[activeImage] && (
            <>
              <span tw="text-sm px-4 py-3 bg-blue-500 text-white-100 rounded-l-lg">
                {nanoItems[activeImage].type1}
              </span>

              <span
                // @ts-ignore
                css={[
                  tw`text-sm px-4 py-3 bg-gray-200 rounded-r-lg`,
                  nanoItems[activeImage].hasType2 &&
                    tw`text-gray-300 line-through`,
                ]}
              >
                {nanoItems[activeImage].type2}
              </span>
            </>
          )}
        </div>
      </div>

      <div tw="sm:() md:(w-[0%]) lg:(w-[3%]) xl:(w-[5%]) hd:(w-[5%]) 2k:(w-[5%]) 4k:(w-[5%]) "></div>

      <aside tw=" md:(w-[100%]) lg:(w-[45%]) xl:(w-[43%]) hd:(w-[43%]) 2k:(w-[38%]) 4k:(w-[43%])  w-full">
        <div tw=" sm:(hidden) md:(block) lg:(block) xl:(block) hd:(block) 2k:(block) 4k:(block)  w-full flex flex-col gap-3">
          <span tw="text-gray-300 font-mono sm:text-base md:text-base lg:text-lg lg:text-lg hd:text-xl 2k:text-xl 4k:text-xl font-light  ">
            Fruits
          </span>
          <span tw="flex flex-wrap items-center gap-4 justify-center sm:text-base md:text-base lg:text-lg lg:text-lg hd:text-xl 2k:text-2xl 4k:text-2xl  font-light pt-[2vh] pb-[3vh] ">
            {nanoItems.map(
              (item, idx) =>
                item.category === "fruit" && (
                  <div
                    key={idx}
                    tw="bg-white-100 px-5 py-3 drop-shadow-2xl shadow-lg rounded-lg cursor-pointer "
                    style={{
                      color: activeImage === idx ? "#FFFFFF" : undefined,
                      boxShadow: "0 0 35px rgba(26, 32, 46, 0.1)",
                      backgroundColor:
                        activeImage === idx ? "#1A202E" : undefined,
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleImageClick(idx, "nano-fruits");
                    }}
                  >
                    {item.title}
                  </div>
                )
            )}
          </span>
        </div>

        <div tw=" sm:(hidden) md:(block) gap-4 lg:(block) xl:(block) hd:(block) 2k:(block) 4k:(block)   w-full flex items-center justify-between mt-[36px]">
          <div tw="sm:(hidden) md:(block) lg:(block) xl:(block) hd:(block) 2k:(block) 4k:(block) w-full flex items-center justify-between  mt-[36px]">
            <div tw="flex gap-3">
              <div tw="flex flex-col gap-3">
                <span tw="text-gray-300 font-mono justify-center sm:text-base md:text-base lg:text-lg lg:text-lg hd:text-xl 2k:text-xl 4k:text-xl font-light">
                  Mix
                </span>
                <span tw="flex items-center justify-between  pb-[5vh]">
                  {nanoItems.map(
                    (item, idx) =>
                      item.category === "mix" && (
                        <div
                          key={idx}
                          tw="bg-white-100 px-5 py-3 drop-shadow-2xl shadow-lg rounded-lg cursor-pointer sm:text-base md:text-base lg:text-lg lg:text-lg hd:text-xl 2k:text-xl 4k:text-xl font-light "
                          style={{
                            color: activeImage === idx ? "#FFFFFF" : undefined,
                            boxShadow: "0 0 35px rgba(26, 32, 46, 0.1)",
                            backgroundColor:
                              activeImage === idx ? "#1A202E" : undefined,
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            handleImageClick(idx, "nano-fruits");
                          }}
                        >
                          {item.title}
                        </div>
                      )
                  )}
                </span>
              </div>

              <div tw="flex flex-col gap-3 ml-auto">
                <span tw="text-gray-300 font-mono justify-center sm:text-base md:text-base lg:text-lg lg:text-lg hd:text-xl 2k:text-xl 4k:text-xl font-light">
                  Greens
                </span>
                <span tw="flex items-center justify-between gap-4 ">
                  {nanoItems.map(
                    (item, idx) =>
                      item.category === "greens" && (
                        <div
                          key={idx}
                          tw="bg-white-100 px-5 py-3 drop-shadow-2xl shadow-lg rounded-lg cursor-pointer sm:text-base md:text-base lg:text-lg lg:text-lg hd:text-xl 2k:text-xl 4k:text-xl font-light "
                          style={{
                            boxShadow: "0 0 35px rgba(26, 32, 46, 0.1)",
                            color: activeImage === idx ? "#FFFFFF" : undefined,
                            backgroundColor:
                              activeImage === idx ? "#1A202E" : undefined,
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            handleImageClick(idx, "nano-greens");
                          }}
                        >
                          {item.title}
                        </div>
                      )
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div tw="  w-full  mt-[40px] ">
          <div tw="w-full ">
            {nanoItems[activeImage] && (
              <>
                <div tw="flex mt-[50px] items-center gap-3 ">
                  <span
                    tw={
                      "sm:text-base md:text-base lg:text-lg lg:text-lg hd:text-xl 2k:text-xl 4k:text-xl px-1 font-bold py-[5px] px-[8px]"
                    }
                    style={{
                      backgroundColor:
                        nanoItems[activeImage]?.title === "dark berry"
                          ? "#D5B7DA80"
                          : nanoItems[activeImage]?.title === "banana"
                          ? "#F0DB0C33"
                          : nanoItems[activeImage]?.title === "blueberries"
                          ? "#1A498B33"
                          : nanoItems[activeImage]?.title === "raspberry"
                          ? "#C5182533"
                          : nanoItems[activeImage]?.title === "spinach"
                          ? "#228C5033"
                          : nanoItems[activeImage]?.title === "mango"
                          ? "#F4BB44"
                          : nanoItems[activeImage]?.title === "cherry"
                          ? "#D2042D80"
                          : nanoItems[activeImage]?.title === "peach"
                          ? "#EBD08A"
                          : nanoItems[activeImage]?.title === "pineapple"
                          ? "#ECDA4F33"
                          : "transparent",
                    }}
                  >
                    {nanoItems[activeImage].size}
                  </span>
                  =
                  <span
                    style={{
                      backgroundColor:
                        nanoItems[activeImage]?.title === "dark berry"
                          ? "#D5B7DA80"
                          : nanoItems[activeImage]?.title === "banana"
                          ? "#F0DB0C33"
                          : nanoItems[activeImage]?.title === "blueberries"
                          ? "#1A498B33"
                          : nanoItems[activeImage]?.title === "raspberry"
                          ? "#C5182533"
                          : nanoItems[activeImage]?.title === "spinach"
                          ? "#228C5033"
                          : nanoItems[activeImage]?.title === "pineapple"
                          ? "#ECDA4F33"
                          : nanoItems[activeImage]?.title === "mango"
                          ? "#F4BB44"
                          : nanoItems[activeImage]?.title === "cherry"
                          ? "#D2042D80"
                          : nanoItems[activeImage]?.title === "peach"
                          ? "#EBD08A"
                          : "transparent",
                    }}
                    tw={
                      "sm:text-base md:text-base lg:text-lg lg:text-lg hd:text-xl 2k:text-xl 4k:text-xl font-bold py-[5px] px-[8px]"
                    }
                  >
                    {nanoItems[activeImage].pouch}
                  </span>
                </div>

                <div tw="flex flex-col gap-3 mt-6">
                  <div
                    tw={
                      "sm:text-base md:text-base lg:text-lg lg:text-lg hd:text-xl 2k:text-xl 4k:text-xl font-light"
                    }
                    dangerouslySetInnerHTML={{
                      __html: nanoItems[activeImage].desc1,
                    }}
                  />
                  <span
                    tw={
                      "sm:text-base md:text-base lg:text-lg lg:text-lg hd:text-xl 2k:text-xl 4k:text-xl font-light"
                    }
                  >
                    {nanoItems[activeImage].desc2}
                  </span>
                </div>

                <div tw=" sm:(block) md:(hidden) lg:(hidden) xl:(hidden) hd:(hidden) 2k:(hidden) 4k:(hidden) w-full border-t border-gray-200 mt-[46px] "></div>

                <motion.div
                  // tw="absolute z-[10] left-[-22%] top-[4%] flex gap-1 cursor-pointer sm:(left-[-20%] top-[20%]) md:(left-[-11%] top-[30%]) lg:(top-[47%] left-[-8%]) xl:(left-[-4.5%]) hd:(left-[-4%]) 2k:(left-[-4%]) 4k:(left-[-3%])"
                  className="group"
                  onClick={toggleShowInfo}
                >
                  <div
                    tw={
                      "text-black-100  text-lg font-bold font-medium mt-[50px] sm:text-base md:text-base lg:text-lg lg:text-lg hd:text-xl 2k:text-xl 4k:text-xl"
                    }
                  >
                    <div tw="flex items-center ">
                      Nutrition&nbsp;Info
                      <Image
                        src={rightArrow}
                        alt="nutrition table button"
                        tw={"scale-125 ml-1"}
                      />
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showInfo && (
            <motion.section
              tw="absolute bottom-0 right-0 max-w-[98vw] bg-white-100/30 z-[10] rounded-tl-3xl rounded-bl-3xl backdrop-blur-xl py-8 px-[6%] md:(max-w-[48rem]) lg:(min-w-[45rem] px-[2%]) 2k:(min-w-[45rem] px-[2%]) 4k:(w-[45rem] px-[2%])
              "
              style={{ boxShadow: "0 0 50px rgba(0, 0, 0, 0.2)" }}
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

        <div tw=" sm:(hidden) md:(flex) lg:(flex) xl:(flex) hd:(flex) 2k:(flex) 4k:(flex) w-full flex flex-col lg:flex-row items-center gap-8 mt-[50px] pt-14  md:(border-t) lg:(border-t) xl:(border-t) hd:(border-t) 2k:(border-t) 4k:(border-t)  border-gray-200">
          <div tw="flex items-end gap-8">
            <CountButton title="minus" onClick={handleDecreaseQuantity}>
              <Minus />
            </CountButton>
            <span tw="flex flex-col items-center justify-center">
              <Typography.H4
                tw={
                  "sm:text-lg md:text-lg lg:text-xl lg:text-xl hd:text-2xl 2k:text-2xl 4k:text-2xl"
                }
              >
                {quantity} / £{nanoItems[activeImage]?.price * quantity}
              </Typography.H4>
              <span tw="font-mono text-neutral-900 text-left sm:text-[11.2px] md:text-[15px] lg:text-[15px] lg:text-[15px] hd:text-[15px] 2k:text-[16px] 4k:text-[16px] ">
                inc. p&p
              </span>
            </span>
            <CountButton title="add" onClick={handleIncreaseQuantity}>
              <Add />
            </CountButton>
          </div>
          <div tw="flex items-center mx-auto">
            {nanoItems[activeImage] && (
              <>
                <span
                  // @ts-ignore
                  css={[
                    tw`text-sm px-4 py-3 bg-blue-500 text-white-100 rounded-l-lg`,
                    !nanoItems[activeImage].hasType1 && tw` line-through`,
                  ]}
                >
                  {nanoItems[activeImage].type1}
                </span>
                <span
                  // @ts-ignore
                  css={[
                    tw`text-sm px-4 py-3 bg-gray-200 rounded-r-lg`,
                    !nanoItems[activeImage].hasType2 &&
                      tw`text-gray-300 line-through`,
                  ]}
                >
                  {nanoItems[activeImage].type2}
                </span>
              </>
            )}
          </div>{" "}
        </div>
        <div
          tw={
            "sm:(hidden) md:block lg:block xl:block hd:block 2k:block 4k:block"
          }
        >
          <SubmitButton
            title="Add to Cart"
            onClick={handleAddToCart}
            tw="w-full mt-14"
          />
        </div>
      </aside>
      <div
        tw={
          " absolute bottom-0 fixed left-0 right-0 pb-0 mb-0 sm:block md:hidden lg:hidden xl:hidden hd:hidden 2k:hidden 4k:hidden"
        }
      >
        <SubmitButton title="Add to Cart" onClick={handleAddToCart} />
      </div>

      <section tw="md:(w-[1%]) lg:(w-[1%]) xl:(w-[5%]) hd:(w-[5%]) 2k:(w-[15%]) 4k:(w-[5%]) w-full  flex flex-col items-center justify-center gap-10"></section>
    </section>
  );
}

