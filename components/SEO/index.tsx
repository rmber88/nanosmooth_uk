import Head from "next/head";
import { useRouter } from "next/router";
import { useMemo } from "react";

export type SEOConfigProps = {
  title: string;
};

export default function SEOConfig({ title }: SEOConfigProps) {
  const router = useRouter();
  const currentUrl = useMemo(() => {
    return router.asPath;
  }, [router]);

  const description = "All the natural flavors at once";
  const name = "Nanosmoothies";
  const ogImageUrl = "/OG.jpeg";

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href="/favicon.png" />
      <meta property="og:site_name" content={name} />
      <meta property="og:description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={name} />
      <meta name="twitter:description" content={description} />
      <meta property="og:image" content={ogImageUrl} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta property="og:url" content={currentUrl} />
    </Head>
  );
}
