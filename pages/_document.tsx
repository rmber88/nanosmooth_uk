import tw from "twin.macro";
import { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

const Document = () => {
  return (
    <Html>
      <Head>
        {/* <meta
          //   name="viewport"
          //   content=" initial-scale=1, maximum-scale=1, user-scalable=no"
          // ></meta>
          // <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        ></meta>
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        ></meta> */}
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com"></link>
      </Head>
      <body>
        <div id="modal"></div>
        <Main />
        <NextScript />
        <Script></Script>
      </body>
    </Html>
  );
};

export default Document;
