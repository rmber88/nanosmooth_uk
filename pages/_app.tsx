import type { AppProps } from "next/app";
import GlobalStyles from "../styles/GlobalStyles";
import "../styles/index.css";
import { useRouter } from "next/router";
import { firebaseAnalytics } from "../firebase/config";
import { useEffect, Fragment } from "react";

import "nprogress/nprogress.css";
import NProgress from "nprogress";
import AOS from "aos";
import "aos/dist/aos.css";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Context from "../context";
import Engine from "../components/layouts/engine";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      center: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteStart = () => NProgress.start();
    const handleRouteDone = () => NProgress.done();

    router.events.on("routeChangeStart", handleRouteStart);
    router.events.on("routeChangeComplete", handleRouteDone);
    router.events.on("routeChangeError", handleRouteDone);

    AOS.init({});
    AOS.refresh();
    return () => {
      router.events.off("routeChangeStart", handleRouteStart);
      router.events.off("routeChangeComplete", handleRouteDone);
      router.events.off("routeChangeError", handleRouteDone);
    };
  });

  useEffect(() => {
    firebaseAnalytics;
  }, []);

  const client = new QueryClient();

  return (
    <Fragment>
      <GlobalStyles />
      <QueryClientProvider client={client}>
        <Context>
          <div className="content">
            <Engine {...{ pageProps, Component }}>
              <Component {...pageProps} />
            </Engine>
          </div>
        </Context>
      </QueryClientProvider>
    </Fragment>
  );
}

export default MyApp;
