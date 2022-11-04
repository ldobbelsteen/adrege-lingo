import { Html, Head, Main, NextScript } from "next/document";

const Document = () => {
  return (
    <Html lang="nl" className="h-full">
      <Head>
        <style>{`#__next { height: 100% }`}</style>
      </Head>
      <body className="h-full">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
