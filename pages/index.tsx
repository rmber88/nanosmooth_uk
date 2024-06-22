import tw from "twin.macro";
import Hero from "../components/home/Hero";
import Navbar from "../components/layouts/reusable/Navbar";
import Description from "../components/home/Description";
import MobileNav from "../components/layouts/reusable/MobileNav";
import SEOConfig from "../components/SEO";
import { useEffect } from "react";

const Home = () => {
  return (
    <main tw="relative w-full flex flex-col ">
      <SEOConfig title="Home" />
      <Navbar />
      <MobileNav />
      <Hero />
      <Description />
    </main>
  );
};

const meta = {
  pageKey: "home",
  layout: "public",
  title: "Home",
  allowAccess: "all",
};

Home.meta = meta;

export default Home;
