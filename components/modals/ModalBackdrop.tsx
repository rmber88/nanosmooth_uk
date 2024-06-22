import tw from "twin.macro";

export default function ModalBackDrop({ ...props }) {
  return (
    <div
      tw="w-full h-full  fixed  backdrop-blur-sm backdrop-contrast-50   inset-0 z-[30]"
      {...props}
    ></div>
  );
}
