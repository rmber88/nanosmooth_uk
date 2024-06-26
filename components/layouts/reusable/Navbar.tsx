/* eslint-disable react/no-unknown-property */
import tw from "twin.macro"; // twin.macro for using Tailwind CSS with styled components
import Image from "next/image"; // Image component from Next.js for optimized images
import useNavScroll from "../../../hooks/useNavScroll"; // Custom hook to handle scroll behavior
import Wrapper from "../wrapper"; // Wrapper component for layout
import { routes } from "./_nav-data"; // Navigation routes data
import { usePathname } from "next/navigation"; // Hook to get the current pathname
import Link from "next/link"; // Link component for client-side navigation
import ActionButton from "../../buttons/ActionButton"; // Custom button component
import logo from "../../../public/images/logo-black.png"; // Logo image
import { useRouter } from "next/router"; // Next.js router for navigation
import styled from "@emotion/styled"; // Styled components using Emotion
import { useEffect, useState } from "react"; // React hooks for state and effect management
import Portal from "../../portal"; // Portal component for modals
import Modal from "../../modals/Modal"; // Modal component
import AuthForm from "../../auth/authForm"; // Authentication form component
import useCurrentUser from "../../../hooks/queries/auth/useCurrentUser"; // Custom hook to get current user data
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase authentication functions
import { firebaseApp } from "../../../firebase/config"; // Firebase configuration
import useUserSubscriptions from "../../../hooks/queries/subscriptions/useUserSubscriptions"; // Custom hook to get user subscription data
import useDeleteCurrentUser from "../../../hooks/mutations/auth/useDeleteCurrentUser"; // Custom hook to delete current user
import handleError from "../../../utils/handleError"; // Utility to handle errors

// Styled component for the navigation bar
const Nav = styled.nav(({ aboveThreshold }: { aboveThreshold: boolean }) => [
  tw`fixed w-full top-0 left-0 z-[9] transition-all duration-300 py-5 hidden lg:block`,
  tw`items-center `,
  aboveThreshold ? tw`bg-white-100/90 backdrop-blur-2xl` : tw`bg-transparent`,
]);

export default function Navbar() {
  const aboveThreshold = useNavScroll(200); // Hook to handle navigation scroll behavior
  const path = usePathname(); // Get the current pathname
  const router = useRouter(); // Initialize router
  const [modalOpen, setModalOpen] = useState(false); // State to manage modal open/close

  const auth = getAuth(firebaseApp); // Get Firebase authentication instance
  const currentUser = useCurrentUser(); // Get current user data
  const [isAuth, setIsAuth] = useState(currentUser); // State to manage authentication status
  const userSubscription = useUserSubscriptions(); // Get user subscription data
  const deleteCurrUser = useDeleteCurrentUser(); // Hook to delete current user

  // Check if the user is authenticated but not subscribed initially
  const isNotInitialSubscribed =
    !!isAuth && !!userSubscription.data && !userSubscription.data?.stripeId;

  // Handler for membership button click
  const handleMembershipPressed = () => {
    if (isNotInitialSubscribed || !isAuth) {
      setModalOpen(true); // Open authentication modal if not subscribed or not authenticated
      return;
    }

    router.push("/membership"); // Navigate to membership page
  };

  // Effect to update authentication status on auth state change
  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      setIsAuth(u);
    });
  }, [auth]);

  return (
    <Nav aboveThreshold={aboveThreshold}>
      <Wrapper tw="pt-8 flex items-center align-bottom ">
        <Link href={"/"}>
          <Image src={logo} alt="NanoSmoothies logo" tw={"w-[58px] h-[58px]"} /> {/* Logo image */}
        </Link>
        <div
          tw={
            " flex w-[100%] justify-between  transform translate-y-[8px] 2k:(pl-8) 4k:(pl-8)"
          }
        >
          <aside tw="flex items-center ml-7 gap-8 2k:(gap-12) 4k:(gap-12)">
            {routes.map((items, idx) => (
              <Link
                key={idx}
                href={items.link}
                tw="transition-all text-zinc-400 font-normal pb-3 border border-transparent border-t-0 border-r-0 border-l-0 hover:(text-black-100 opacity-30 border-gray-200 font-semibold) lg:(text-xl) xl:(text-xl) hd:(text-xl) 2k:(text-xl) 4k:(text-3xl)"
                style={{
                  color: path === items.link ? "#000000" : undefined, // Highlight active link
                  fontWeight: path === items.link ? "semibold" : undefined,
                }}
              >
                {items.title}
              </Link>
            ))}
          </aside>

          <div tw="flex items-center gap-8 2k:(gap-12) 4k:(gap-12) ">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <Link
              href="/nano?tab=nano-fruits"
              tw="transition-all text-zinc-400 font-normal pb-3 border border-transparent border-t-0 border-r-0 hover:(text-black-100 opacity-30 border-gray-200 font-semibold) lg:(text-xl) xl:(text-xl) hd:(text-xl) 2k:(text-xl) 4k:(text-3xl)"
            >
              <span tw="text-zinc-400 font-semibold lg:(text-xl) xl:(text-xl) hd:(text-xl) 2k:(text-2xl) 4k:(text-3xl)">
                nano
              </span>
              <span tw="text-zinc-400 font-normal lg:(text-xl) xl:(text-xl) hd:(text-xl) 2k:(text-2xl) 4k:(text-3xl)">
                fruits
              </span>
            </Link>

            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <Link
              href="/nano?tab=nano-greens&activeImage=4"
              tw="transition-all text-zinc-400 font-normal pb-3 border border-transparent border-t-0 border-r-0  hover:(text-black-100 opacity-30 border-gray-200 font-semibold) lg:(text-xl) xl:(text-xl) hd:(text-xl) 2k:(text-xl) 4k:(text-3xl)"
            >
              <span tw="text-zinc-400 font-semibold lg:(text-xl) xl:(text-xl) hd:(text-xl) 2k:(text-2xl) 4k:(text-3xl)">
                nano
              </span>
              <span tw="text-zinc-400 font-normal lg:(text-xl) xl:(text-xl) hd:(text-xl) 2k:(text-2xl) 4k:(text-3xl)">
                greens
              </span>
            </Link>
            {isAuth && path === "/membership" && (
              <div tw={"flex items-end ml-auto translate-y-[-6px] transform"}>
                <span tw="  text-black-100 text-lg font-semibold lg:(text-xl) xl:(text-xl) hd:(text-xl)2k:(text-2xl) 4k:(text-3xl)">
                  {currentUser?.displayName?.split(" ")[0] ?? ""}
                </span>
              </div>
            )}
          </div>
          {path !== "/membership" && (
            <ActionButton
              title={"Your membership"}
              tw="text-lg text-zinc-400 font-medium md:(py-4 px-6)  lg:(text-xl py-2 px-4) xl:(text-xl py-2 px-4) hd:(text-xl py-3 px-4) xl:(text-lg py-3 px-4) hd:(text-xl py-3 px-6) 2k:(text-xl py-5 px-9) 4k:(text-3xl py-6 px-8)  transform translate-y-[-8px]  "
              style={{
                color: path === "/membership" ? "#ffffff" : undefined, // Highlight button when on membership page
                backgroundColor: path === "/membership" ? "#1A202E" : undefined,
              }}
              onClick={() => handleMembershipPressed()} // Handle membership button click
            />
          )}
        </div>
        <Portal isOpen={modalOpen}>
          <Modal>
            <AuthForm
              isModal
              onClose={() => {
                setModalOpen(false); // Close modal on close
              }}
              onSuccess={() => {
                setModalOpen(false); // Close modal on success
              }}
            />
          </Modal>
        </Portal>
      </Wrapper>
    </Nav>
  );
}