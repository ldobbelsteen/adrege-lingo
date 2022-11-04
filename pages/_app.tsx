import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { SWRConfig } from "swr";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string, init: RequestInit) =>
          fetch(url, init).then((res) => res.json()),
      }}
    >
      <Head>
        <title>Lingo</title>
      </Head>
      <main className="flex flex-col items-center justify-center overflow-hidden bg-adrege min-h-full text-center text-white p-2">
        <Component {...pageProps} />
      </main>
    </SWRConfig>
  );
};

export default App;
