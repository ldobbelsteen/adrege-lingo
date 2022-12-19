import type { NextPage } from "next";
import dynamic from "next/dynamic";

const Lingo = dynamic(() => import("../components/Lingo"), {
  ssr: false,
});

const Index: NextPage = () => {
  return (
    <>
      <h1>Lingo</h1>
      <Lingo />
    </>
  );
};

export default Index;
