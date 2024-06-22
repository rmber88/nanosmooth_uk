/* eslint-disable react/no-unknown-property */
/* eslint-disable @next/next/no-html-link-for-pages */
import { useEffect, useState } from "react";
import tw from "twin.macro";
import { Icon } from "@iconify/react";
import { routes } from "./_nav-data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import Image from "next/image";
import logo from "../../../public/images/mobile-logo.webp";
import useCurrentUser from "../../../hooks/queries/auth/useCurrentUser";
import useUserSubscriptions from "../../../hooks/queries/subscriptions/useUserSubscriptions";
import useDeleteCurrentUser from "../../../hooks/mutations/auth/useDeleteCurrentUser";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firebaseApp } from "../../../firebase/config";

export default function MobileNav() {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const path = usePathname();
  const router = useRouter();
  const auth = getAuth(firebaseApp);
  const currentUser = useCurrentUser();
  const [isAuth, setIsAuth] = useState(currentUser);

  const userSubscription = useUserSubscriptions();

  const isNotInitialSubscribed =
    !!isAuth && !!userSubscription.data && !userSubscription.data?.stripeId;

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      setIsAuth(u);
    });
  }, [auth]);

  const handleMembershipPressed = async () => {
    if (isNotInitialSubscribed) {
      await auth.signOut();
      return;
    }

    router.push("/membership");
  };

  return (
    <nav tw="relative z-[99] flex lg:hidden">
      <div tw="flex ml-auto">
        {!openMenu && (
          <Icon
            icon={"mdi-menu"}
            width={26}
            height={26}
            onClick={() => setOpenMenu(!openMenu)}
            tw="relative z-[999] mt-4 mr-5 cursor-pointer ml-auto w-[32px] h-[32px]"
          />
        )}
      </div>

      <menu
        tw="fixed -top-4 left-0 right-0 p-0 w-[100vw] h-[100vh] flex flex-col gap-6 items-center justify-center bg-blue-500 transition-all duration-300"
        style={{
          transform: openMenu ? "scale(100%)" : "scale(0)",
        }}
      >
        <div tw="absolute top-4 right-4">
          <Icon
            icon={openMenu ? "mdi-close" : "mdi-menu"}
            width={24}
            height={24}
            onClick={() => setOpenMenu(!openMenu)}
            tw="relative z-[999] mt-4 mr-5 cursor-pointer ml-auto"
            color={openMenu ? "#FFFFFF" : ""}
          />
        </div>

        <div
          tw="w-[16rem] border-b border-[#252D41] py-4"
          onClick={() => router.push("/")}
        >
          <Image src={logo} width={0} height={0} alt="logo" />
        </div>

        <ul tw="w-full flex flex-col items-center justify-center gap-6">
          {routes.map((items, idx) => (
            <Link
              key={`link-${items.title}-${idx}`}
              href={items.link}
              tw="w-[16rem] text-white-100  text-center border-b border-[#252D41] py-6 hover:(text-gray-200)"
              style={{
                color: path === items.link ? "rgb(229 231 235)" : undefined,
              }}
            >
              {items.title}
            </Link>
          ))}
        </ul>

        <div tw="w-full mx-auto flex items-center justify-center gap-20 ">
          <a
            href="/nano?tab=nano-greens&activeImage=4"
            tw="font-semibold text-white-100 hover:(text-gray-300)"
            onClick={(e) => {
              e.preventDefault();
              router.push("/nano?tab=nano-greens&activeImage=4");
            }}
          >
            nano<span tw="font-normal">greens</span>
          </a>

          <a
            href="/nano?tab=nano-fruits"
            tw="font-semibold text-white-100 hover:(text-gray-300)"
            onClick={(e) => {
              e.preventDefault();
              router.push("/nano?tab=nano-fruits");
            }}
          >
            nano<span tw="font-normal">fruits</span>
          </a>
        </div>

        <button
          tw="w-full flex items-center justify-center text-center bg-[#303642] text-white-100 py-7"
          onClick={handleMembershipPressed}
        >
          Your Subscription
        </button>
      </menu>
    </nav>
  );
}
