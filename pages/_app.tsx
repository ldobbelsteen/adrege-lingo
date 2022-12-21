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
      <div className="w-full h-full  bg-[url('/tornado.svg')] bg-no-repeat bg-right bg-contain bg-bordeaux">
        <main
          className={`${myFont.className} flex flex-col items-center justify-center overflow-hidden min-h-full text-center text-white text-xl p-2 bg-[url('/sneeuw.svg')] bg-repeat-x bg-bottom`}
        >
          <Component {...pageProps} />
        </main>
      </div>
    </>
  );
};

export default App;
