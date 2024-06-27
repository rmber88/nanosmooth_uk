/* eslint-disable react/no-unknown-property */
/* eslint-disable @next/next/no-html-link-for-pages */
import { useEffect, useState } from "react"; // React hooks for state and effect management
import tw from "twin.macro"; // twin.macro for using Tailwind CSS with styled components
import { Icon } from "@iconify/react"; // Icon component for rendering icons
import { routes } from "./_nav-data"; // Navigation routes data
import Link from "next/link"; // Link component for client-side navigation
import { usePathname } from "next/navigation"; // Hook to get the current pathname
import { useRouter } from "next/router"; // Next.js router for navigation
import Image from "next/image"; // Image component from Next.js for optimized images
import logo from "../../../public/images/mobile-logo.webp"; // Logo image
import useCurrentUser from "../../../hooks/queries/auth/useCurrentUser"; // Custom hook to get current user data
import useUserSubscriptions from "../../../hooks/queries/subscriptions/useUserSubscriptions"; // Custom hook to get user subscription data
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase authentication functions
import { firebaseApp } from "../../../firebase/config"; // Firebase configuration

export default function MobileNav() {
  const [openMenu, setOpenMenu] = useState<boolean>(false); // State to manage menu open/close
  const path = usePathname(); // Get the current pathname
  const router = useRouter(); // Initialize router
  const auth = getAuth(firebaseApp); // Get Firebase authentication instance
  const currentUser = useCurrentUser(); // Get current user data
  const [isAuth, setIsAuth] = useState(currentUser); // State to manage authentication status

  const userSubscription = useUserSubscriptions(); // Get user subscription data

  // Check if the user is authenticated but not subscribed initially
  const isNotInitialSubscribed =
    !!isAuth && !!userSubscription.data && !userSubscription.data?.stripeId;

  // Effect to update authentication status on auth state change
  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      setIsAuth(u);
    });
  }, [auth]);

  // Handler for membership button click
  const handleMembershipPressed = async () => {
    if (isNotInitialSubscribed) {
      await auth.signOut(); // Sign out the user if not initially subscribed
      return;
    }

    router.push("/membership"); // Navigate to membership page
  };

  return (
    <nav tw="relative z-[99] flex lg:hidden">
      <div tw="flex ml-auto">
        {!openMenu && (
          <Icon
            icon={"mdi-menu"}
            width={26}
            height={26}
            onClick={() => setOpenMenu(!openMenu)} // Toggle menu open/close
            tw="relative z-[999] mt-4 mr-5 cursor-pointer ml-auto w-[32px] h-[32px]"
          />
        )}
      </div>

      <menu
        tw="fixed -top-4 left-0 right-0 p-0 w-[100vw] h-[100vh] flex flex-col gap-6 items-center justify-center bg-blue-500 transition-all duration-300"
        style={{
          transform: openMenu ? "scale(100%)" : "scale(0)", // Scale menu based on openMenu state
        }}
      >
        <div tw="absolute top-4 right-4">
          <Icon
            icon={openMenu ? "mdi-close" : "mdi-menu"}
            width={24}
            height={24}
            onClick={() => setOpenMenu(!openMenu)} // Toggle menu open/close
            tw="relative z-[999] mt-4 mr-5 cursor-pointer ml-auto"
            color={openMenu ? "#FFFFFF" : ""}
          />
        </div>

        <div
          tw="w-[16rem] border-b border-[#252D41] py-4"
          onClick={() => router.push("/")} // Navigate to home page
        >
          <Image src={logo} width={0} height={0} alt="logo" /> {/* Logo image */}
        </div>

        <ul tw="w-full flex flex-col items-center justify-center gap-6">
          {routes.map((items, idx) => (
            <Link
              key={`link-${items.title}-${idx}`}
              href={items.link}
              tw="w-[16rem] text-white-100 text-center border-b border-[#252D41] py-6 hover:(text-gray-200)"
              style={{
                color: path === items.link ? "rgb(229 231 235)" : undefined, // Highlight active link
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
              e.preventDefault(); // Prevent default anchor behavior
              router.push("/nano?tab=nano-greens&activeImage=4"); // Navigate to nano-greens section
            }}
          >
            nano<span tw="font-normal">greens</span>
          </a>

          <a
            href="/nano?tab=nano-fruits"
            tw="font-semibold text-white-100 hover:(text-gray-300)"
            onClick={(e) => {
              e.preventDefault(); // Prevent default anchor behavior
              router.push("/nano?tab=nano-fruits"); // Navigate to nano-fruits section
            }}
          >
            nano<span tw="font-normal">fruits</span>
          </a>
        </div>

        <button
          tw="w-full flex items-center justify-center text-center bg-[#303642] text-white-100 py-7"
          onClick={handleMembershipPressed} // Handle membership button click
        >
          Your Subscription
        </button>
      </menu>
    </nav>
  );
}