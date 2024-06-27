import tw from "twin.macro"; // twin.macro for using Tailwind CSS with styled components
import Typography from "../typography"; // Typography component for text styles
import Wrapper from "../layouts/wrapper"; // Wrapper component for layout
import { useCallback, useEffect, useRef, useState } from "react"; // React hooks
import TheFreezeDryingProcess from "../modals/common/TheFreezeDryingProcess"; // Modal component for freeze-drying process
import Hls from "hls.js"; // HLS.js for streaming
//@ts-ignore
import Video from "next-video"; // Next.js video component
import VideoPlayer from "../videoPlayer"; // Custom video player component
//@ts-ignore
import MuxPlayer from "@mux/mux-player-react"; // Mux player for video streaming

// URLs for the web and mobile videos
const webVideo =
  "https://firebasestorage.googleapis.com/v0/b/nanosmoothies-0.appspot.com/o/web%20hero%20video.mp4?alt=media&token=994a5609-7635-4056-8164-9eead5b2dcf6";

const mobileVideo =
  "https://stream.mux.com/taYR01IBDGuHuXZ8YsqL432NN54iskRjsgPZXBFatV68.m3u8";

export default function Hero() {
  const [isOpen, setisOpen] = useState(false); // State for modal open/close

  // Toggle modal open/close state
  const toggleModal = useCallback(() => {
    setisOpen((p) => !p);
  }, []);

  return (
    // Main container with responsive height
    <main tw="relative w-full xl:(h-[100vh]) lg:(h-[100vh]) md:(pt-[30px]) hd:(h-[105vh]) 2k:(h-[105vh]) 4k:(h-[85vh])">
      {/* Web video section */}
      <div tw="hidden lg:(block h-[50vh] mt-[10%]) h-[100vh]">
        <div tw="absolute top-0 lg:(top-[4vh]) xl:(top-[4vh]) hd:(top-[4vh]) 2k:(top-[0vh]) 4k:(top-[0vh]) z-[-90] 2k:max-w-full 4k:(max-w-[80%]) leading-none">
          <video
            src={webVideo}
            autoPlay
            loop
            muted
            controls={false}
            tw="w-full h-full object-cover"
          />
        </div>

        <Wrapper tw="px-[8%] md:(px-[8%]) lg:(px-[12%] transform translate-y-[-54%]) xl:(px-[10%] transform translate-y-[-58%]) hd:(px-[10%] transform translate-y-[-62%]) 2k:(px-[10%] transform translate-y-[-64%]) 4k:(px-[6%] transform translate-y-[-86%]) pt-[22%] hidden lg:(block)">
          <article
            tw="flex flex-col w-max cursor-pointer"
            onClick={toggleModal}
          >
            {/* Brand name and clickable text */}
            <span tw="relative font-normal lg:(text-5xl) xl:(text-6xl) hd:(text-5xl) 2k:(text-8xl) 4k:(text-8xl) leading-[0.8]  ">
              <span tw="font-bold">nano</span>
              <span tw="font-normal">smoothies</span>
              <span>®</span>
            </span>

            <div tw="justify-start flex ml-[2.5rem] z-[2]">
              <Typography.P tw="!leading-[1rem] font-medium lg:(text-2xl) xl:(text-xl) hd:(text-lg) 2k:(text-4xl) 4k:(text-4xl)">
                Why Freeze-Dried?
              </Typography.P>
              <span tw="!leading-[0.8rem] font-medium transform -translate-y-1 h-[24px] w-[24px] lg:(w-[18px] h-[18px] -translate-y-0.5 scale-75) hd:(pt-1 w-[20px] h-[20px] -translate-y-1 scale-75) xl:(-translate-y-0 scale-75) 2k:(pt-3 px-1 scale-150 -translate-y-4 scale-125) 4k:(px-1 scale-150 -translate-y-4)">
                ⓘ
              </span>
            </div>
          </article>
        </Wrapper>
      </div>

      {/* Mobile video section */}
      <Wrapper tw="h-[110vh] sm:(h-[100vh]) md:(h-[150vh]) flex items-center gap-5 flex-col lg:(hidden)">
        <article
          tw="relative flex flex-col w-max  transform translate-y-[35px]"
          onClick={toggleModal}
        >
          <Typography.H1 tw="relative font-normal sm:(text-black-100 text-[40px] font-bold leading-[45px]) md:(text-5xl)">
            <span tw="font-bold">nano</span>
            <span tw="font-normal">smoothies</span>
            <span>®</span>
          </Typography.H1>

          <div tw="justify-start pl-[8%] flex items-start gap-1 z-[2]">
            <Typography.P tw="text-[1.2rem] font-medium sm:(text-center text-black-100 text-sm text-[17px] leading-[0.25rem]) md:(text-xl)">
              Why Freeze-Dried?
            </Typography.P>
            <span tw="sm:(font-medium transform -translate-y-3 translate-x-[-5.5px] scale-50) md:(px-0 -translate-y-0 scale-75 translate-x-0)">
              ⓘ
            </span>
          </div>
        </article>

        <article tw="absolute top-0 translate-y-[-12vh] w-[100%] z-[-999] h-full mx-0 px-0 lg:(block) leading-none">
          <VideoPlayer src={mobileVideo} />
        </article>
      </Wrapper>

      {/* Modal for the freeze-drying process */}
      <TheFreezeDryingProcess isOpen={isOpen} onClose={toggleModal} />
    </main>
  );
}