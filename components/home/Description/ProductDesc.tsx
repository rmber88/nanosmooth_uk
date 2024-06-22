import tw from "twin.macro";
import { Swiper, SwiperSlide } from "swiper/react";
import Typography from "../../typography";
import { Navigation, Autoplay } from "swiper/modules";
import { desc } from "./_data";
import "swiper/css";
import "swiper/css/pagination";

export default function ProductDesc() {
  return (
    <section tw="relative w-full px-2 pb-14 2k:(w-[820px] px-[45.20px]  pb-[45.20px] flex-col gap-[33.15px] items-start)">
      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={20}
        centeredSlides={true}
        direction={"horizontal"}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        navigation={true}
        tw="w-full relative cursor-pointer"
      >
        {desc.map((items, idx) => (
          <SwiperSlide key={idx}>
            <article tw="flex flex-col gap-[19px] sm:(gap-[14px]) ">
              <Typography.H1 tw="text-black-100 font-bold capitalize pb-0 mb-0   text-[80px] sm:text-[30px] md:text-[35px] lg:text-[35px] xl:text-[35px] hd:text-[35px] 2k:text-[50px] 4k:text-[50px] mb-4">
                {items.title}
              </Typography.H1>

              <Typography.P
                tw="relative pl-5
                  before:(px-[0.05em] h-4 rounded-lg bg-slate-500 absolute top-[0.9vh] md:(top-[0.6vh])  lg:(top-[0.9vh]) left-0)
                  text-black-100 font-light
                  sm:(text-sm) md:(text-base) lg:(text-sm) xl:(text-sm) hd:(text-sm) 2k:(text-lg) 4k:(text-lg)
                "
              >
                {items.part1}
              </Typography.P>
              <Typography.P
                tw="relative pl-5
                  before:(px-[0.05em] h-4 rounded-lg bg-gray-800 opacity-20 absolute top-[0.9vh] md:(top-[0.6vh]) lg:(top-[0.9vh])  xl:(top-[0.5vh]) left-0)
                  text-black-100 font-light
                  sm:(text-sm) md:(text-base) lg:(text-sm) xl:(text-sm) hd:(text-sm) 2k:(text-lg) 4k:(text-lg)
                "
              >
                {items.part2}
              </Typography.P>
              <Typography.P
                tw="relative pl-5
                  before:(px-[0.05em] h-4 rounded-lg bg-gray-800 opacity-20 absolute top-[0.9vh]   lg:(top-[0.9vh]) md:(top-[0.6vh]) left-0)
                  text-black-100 font-light
                  sm:(text-sm) md:(text-base) lg:(text-sm) xl:(text-sm) hd:(text-sm) 2k:(text-lg) 4k:(text-lg)
                "
              >
                {items.part3}
              </Typography.P>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
