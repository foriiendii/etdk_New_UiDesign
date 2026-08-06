import { type AppType } from "next/app";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import "../styles/globals.css";
import Layout from "../components/Layout";
import { SessionProvider } from "next-auth/react";
import { SWRConfig } from "swr";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  // Get theme colors from pageProps (passed from getServerSideProps)
  const themeColors = pageProps.themeColors as
    | { primaryLight: string; primaryDark: string; secondaryColor: string }
    | undefined;
  const primaryLight = themeColors?.primaryLight || "#432559";
  const primaryDark = themeColors?.primaryDark || "#2a2143";
  const secondaryColor = themeColors?.secondaryColor || "#c7237a";

  return (
    <>
      <Head>
        <style>
          {`:root {
            --color-primary-light: ${primaryLight};
            --color-primary-dark: ${primaryDark};
            --color-secondary: ${secondaryColor};
          }`}
        </style>
      </Head>
      <SWRConfig
        value={{
          refreshInterval: 5000,
        }}
      >
        <SessionProvider session={session}>
          <Layout>
            <Component {...pageProps} />
            <Toaster position="bottom-center" />
            <Analytics />
          </Layout>
        </SessionProvider>
      </SWRConfig>
    </>
  );
};

export default MyApp;
