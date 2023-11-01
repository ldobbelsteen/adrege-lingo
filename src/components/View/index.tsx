import React from "react";
import Lingo from "./Lingo";

export const View = () => {
  return (
    <div className={`w-full h-full bg-brandweerrood`}>
      <main
        className={`flex flex-col items-center overflow-hidden min-h-full text-center text-wit text-xl p-2 bg-[url('../assets/sneeuw.svg')] bg-repeat-x bg-bottom`}
      >
        <Lingo />
      </main>
    </div>
  );
};
