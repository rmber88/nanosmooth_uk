/* eslint-disable react/no-unknown-property */
import tw from "twin.macro";
import Image from "next/image";
import useNavScroll from "../../../hooks/useNavScroll";
import Wrapper from "../wrapper";
import { routes } from "./_nav-data";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ActionButton from "../../buttons/ActionButton";
import logo from "../../../public/images/logo-black.png";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import Portal from "../../portal";
import Modal from "../../modals/Modal";
import AuthForm from "../../auth/authForm";
import useCurrentUser from "../../../hooks/queries/auth/useCurrentUser";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firebaseApp } from "../../../firebase/config";
import useUserSubscriptions from "../../../hooks/queries/subscriptions/useUserSubscriptions";
import useDeleteCurrentUser from "../../../hooks/mutations/auth/useDeleteCurrentUser";
import handleError from "../../../utils/handleError";

const Nav = styled.nav(({ aboveThreshold }: { aboveThreshold: boolean }) => [
  tw`fixed w-full top-0 left-0 z-[9] transition-all duration-300 py-5 hidden lg:block`,
  tw`items-center `,
  aboveThreshold ? tw`bg-white-100/90 backdrop-blur-2xl` : tw`bg-transparent`,
]);

export default function Navbar() {
  const aboveThreshold = useNavScroll(200);
  const path = usePathname();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const auth = getAuth(firebaseApp);
  const currentUser = useCurrentUser();
  const [isAuth, setIsAuth] = useState(currentUser);
  const userSubscription = useUserSubscriptions();
  const deleteCurrUser = useDeleteCurrentUser();

  const isNotInitialSubscribed =
    !!isAuth && !!userSubscription.data && !userSubscription.data?.stripeId;

  const handleMembershipPressed = () => {
    if (isNotInitialSubscribed || !isAuth) {
      setModalOpen(true);
      return;
    }

    router.push("/membership");
  };

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      setIsAuth(u);
    });
  }, [auth]);

  return (
    <Nav aboveThreshold={aboveThreshold}>
      <Wrapper tw="pt-8 flex items-center align-bottom ">
        <Link href={"/"}>
          <Image src={logo} alt="NanoSmoothies logo" tw={"w-[58px] h-[58px]"} />
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
                  color: path === items.link ? "#000000" : undefined,
                  fontWeight: path === items.link ? "semibold" : undefined,
                }}
              >
                {items.title}
              </Link>
            ))}
          </aside>

          <div tw="flex items-center gap-8 2k:(gap-12) 4k:(gap-12) ">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages
             */}
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
                color: path === "/membership" ? "#ffffff" : undefined,
                backgroundColor: path === "/membership" ? "#1A202E" : undefined,
              }}
              onClick={() => handleMembershipPressed()}
            />
          )}
        </div>
        <Portal isOpen={modalOpen}>
          <Modal>
            <AuthForm
              isModal
              onClose={() => {
                setModalOpen(false);
              }}
              onSuccess={() => {
                setModalOpen(false);
              }}
            />
          </Modal>
        </Portal>
      </Wrapper>
    </Nav>
  );
}
