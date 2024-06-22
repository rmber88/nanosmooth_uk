import { Fragment, MouseEventHandler, ReactNode } from "react";
import ModalBackDrop from "./ModalBackdrop";
import ModalWrapper from "./ModalWrapper";

export type ModalHeaderProps = {
  onClose?: MouseEventHandler;
  disableClose?: boolean;
};

export type ModalProps = {
  children: ReactNode;
  aside?: boolean;
} & ModalHeaderProps;

export default function Modal({
  children,
  disableClose,
  onClose,
  ...otherProps
}: ModalProps) {
  return (
    <Fragment>
      <ModalWrapper {...otherProps}>
        <ModalWrapper.container>{children}</ModalWrapper.container>
      </ModalWrapper>
      <ModalBackDrop />
    </Fragment>
  );
}
