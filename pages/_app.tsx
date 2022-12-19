import "../styles/globals.css";
import localFont from "@next/font/local";
import type { AppProps } from "next/app";
import Head from "next/head";

const myFont = localFont({ src: "../styles/GoBoom.ttf" });

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Lingo</title>
      </Head>
      <main
        className={`${myFont.className} flex flex-col items-center justify-center overflow-hidden bg-bordeaux min-h-full text-center text-white text-xl p-2`}
      >
        <Component {...pageProps} />
      </main>
    </>
  );
};

export default App;
