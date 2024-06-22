import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";

const VideoPlayer = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video: any = videoRef.current;

    const handlePlay = () => {
      setIsPlaying(true);
    };

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video?.addEventListener("play", handlePlay);
        // setTimeout(() => {
        handlePlayClick();
        // }, 3000);
      });
    } else if (video && video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.addEventListener("loadedmetadata", () => {});
    }

    return () => {
      video?.removeEventListener("play", handlePlay);
    };
  }, [src]);

  const handlePlayClick = () => {
    const video = videoRef.current;
    video?.play();
  };

  return (
    <div>
      <video
        ref={videoRef}
        muted={true}
        autoPlay={isPlaying}
        loop
        playsInline
        controls={false}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "translate(-50%, -50%)",
          zIndex: "-1",
        }}
      >
        Your browser does not support the video tag.
      </video>
      {!isPlaying && (
        <button ref={buttonRef} onClick={handlePlayClick}></button>
      )}
    </div>
  );
};

export default VideoPlayer;
