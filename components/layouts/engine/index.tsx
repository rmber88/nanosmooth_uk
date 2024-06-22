import { AppProps } from "next/app";
import { Fragment, PropsWithChildren, useEffect } from "react";
import tw from "twin.macro";
import useCurrentUserDb from "../../../hooks/queries/auth/useCurrentUserDb";
import { ButtonSpinner } from "../../buttons/buttonSpinner";
import Typography from "../../typography";
import { useRouter } from "next/router";
import { Warning2 } from "iconsax-react";
import AdminLayout from "./AdminLayout";
import SEOConfig from "../../SEO";

type EngineProps = {
  Component: AppProps["Component"];
} & PropsWithChildren;

export default function Engine({ Component, children }: EngineProps) {
  const meta = (Component as any)?.meta;
  const router = useRouter();
  const currentUserDb = useCurrentUserDb();
  const isLoading = currentUserDb.isInitialLoading && !currentUserDb.data;
  const isAdminRoute = meta?.allowAccess === "admin";
  const canAccess = isAdminRoute && currentUserDb.data?.role === "admin";

  useEffect(() => {
    currentUserDb.refetch();
  }, [currentUserDb]);

  if (!isAdminRoute) {
    return (
      <Fragment>
        <div>{children}</div>
      </Fragment>
    );
  }

  if (isLoading) {
    return (
      <Fragment>
        <div tw="h-screen w-screen grid place-content-center ">
          <span tw="flex gap-2">{ButtonSpinner} loading...</span>
        </div>
      </Fragment>
    );
  }

   if (canAccess) {
     return <AdminLayout>{children}</AdminLayout>;
   }

   return (
     <Fragment>
       <SEOConfig title="Restricted area" />
       <main tw="h-screen grid place-content-center ">
         <div tw="flex flex-col items-center gap-3 max-w-md text-center py-8">
           <span tw="p-4 rounded-full bg-pink-50 text-pink-800">
             <Warning2 />
           </span>

           <Typography.H4>Restricted Area</Typography.H4>
           <Typography.P isGrey>
             Uh-oh! You&apos;re not permitted to access this page. Please tap
             the button below to go back.
           </Typography.P>
           <button
             tw="rounded-xl px-4 py-2 border shadow transition-all hover:(bg-gray-50)"
             onClick={() => router.push("/")}
           >
             Back home
           </button>
         </div>
       </main>
     </Fragment>
   );
}
