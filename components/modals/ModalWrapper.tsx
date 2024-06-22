import { CSSProperties, ReactNode } from "react";
import tw from "twin.macro";

interface ModalWrapperProps {
  children: ReactNode;
  aside?: boolean; //** for side modals */
}

interface ModalContainerProps {
  children: ReactNode;
  extraStyles?: CSSProperties;
}

export default function ModalWrapper({
  children,
  aside,
  ...otherProps
}: ModalWrapperProps) {
  return (
    <section
      tabIndex={-1}
      tw="inset-0 fixed z-[999] overflow-y-auto"
      onScroll={(e) => e.stopPropagation()}
    >
      {aside ? (
        <div
          className="from-right"
          role="dialog"
          tw="bg-white-100 relative h-[1000vh] box-border overflow-y-scroll  py-8 bg-clip-padding   md:(max-w-[29.75rem] my-10 mr-10 rounded-3xl ml-[calc(100vw - 29.75rem)] h-[90vh]) "
          {...otherProps}
        >
          {children}
        </div>
      ) : (
        <div
          className="ease-up"
          role="dialog"
          {...otherProps}
          tw="bg-white-100 relative mx-auto box-border bg-clip-padding rounded-3xl sm:(w-[90%] mt-[20%]) md:(w-[60%] mt-[20%])  lg:(w-[60%]) xl:(w-[50%])  hd:(w-[40%])  2k:(w-[36%]) 4k:(w-[36%]) md:(mt-20)"
        >
          {children}
        </div>
      )}
    </section>
  );
}

function Container({ children, extraStyles }: ModalContainerProps) {
  return <section style={extraStyles}>{children}</section>;
}

ModalWrapper.container = Container;
