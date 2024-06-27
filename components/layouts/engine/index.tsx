import { AppProps } from "next/app"; // Importing AppProps type from Next.js
import { Fragment, PropsWithChildren, useEffect } from "react"; // Importing React components and hooks
import tw from "twin.macro"; // twin.macro for using Tailwind CSS with styled components
import useCurrentUserDb from "../../../hooks/queries/auth/useCurrentUserDb"; // Custom hook to get current user data
import { ButtonSpinner } from "../../buttons/buttonSpinner"; // Spinner component for loading state
import Typography from "../../typography"; // Typography component for text styles
import { useRouter } from "next/router"; // Next.js router for navigation
import { Warning2 } from "iconsax-react"; // Warning icon component
import AdminLayout from "./AdminLayout"; // Admin layout component
import SEOConfig from "../../SEO"; // SEO configuration component

// Type definition for Engine component props
type EngineProps = {
  Component: AppProps["Component"];
} & PropsWithChildren;

export default function Engine({ Component, children }: EngineProps) {
  const meta = (Component as any)?.meta; // Accessing meta information from the Component
  const router = useRouter(); // Initializing router
  const currentUserDb = useCurrentUserDb(); // Getting current user data
  const isLoading = currentUserDb.isInitialLoading && !currentUserDb.data; // Checking if data is loading
  const isAdminRoute = meta?.allowAccess === "admin"; // Checking if the route requires admin access
  const canAccess = isAdminRoute && currentUserDb.data?.role === "admin"; // Checking if the user has admin access

  // Refetch current user data on component mount
  useEffect(() => {
    currentUserDb.refetch();
  }, [currentUserDb]);

  // If the route doesn't require admin access, render the children components
  if (!isAdminRoute) {
    return (
      <Fragment>
        <div>{children}</div>
      </Fragment>
    );
  }

  // If data is loading, show a loading spinner
  if (isLoading) {
    return (
      <Fragment>
        <div tw="h-screen w-screen grid place-content-center ">
          <span tw="flex gap-2">{ButtonSpinner} loading...</span>
        </div>
      </Fragment>
    );
  }

  // If the user has admin access, render the admin layout
  if (canAccess) {
    return <AdminLayout>{children}</AdminLayout>;
  }

  // If the user does not have admin access, show a restricted area message
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