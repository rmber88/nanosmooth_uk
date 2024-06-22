import { Fragment, PropsWithChildren } from "react";
import { PurchaseProvider } from "./PurchaseContext";
import { CartProvider } from "./CartContext";
import { UserDetailsProvider } from "./UserDetailsContext";
import { Toaster } from "react-hot-toast";

export default function Context({ children }: PropsWithChildren) {
  return (
    <Fragment>
      <Toaster />
      <PurchaseProvider>
        <CartProvider>
          <UserDetailsProvider>{children}</UserDetailsProvider>
        </CartProvider>
      </PurchaseProvider>
    </Fragment>
  );
}
