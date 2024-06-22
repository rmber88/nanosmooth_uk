import { PropsWithChildren } from "react";
import tw from "twin.macro";
import SEOConfig from "../../SEO";
import Navbar from "../reusable/Navbar";
import MobileNav from "../reusable/MobileNav";

export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <main>
      <SEOConfig title="Nano admin" />
      <Navbar />
      <MobileNav />

      {children}
    </main>
  );
}
