import React, { useEffect } from "react";

export const Console = () => {
  useEffect(() => {
    const view = window.open(
      "/?view",
      undefined,
      `width=${0.6 * window.innerWidth},height=${
        0.6 * window.innerHeight
      },left=${0.2 * window.innerWidth},top=${0.2 * window.innerHeight}`,
    );
    if (!view) {
      console.error("kan geen popup openen :(");
      return;
    }
    window.onbeforeunload = () => view.close();
    view.onbeforeunload = () => window.close();
  }, []);

  return (
    <div className={`w-full h-full bg-brandweerrood`}>
      <main
        className={`flex flex-col items-center overflow-hidden min-h-full text-center text-wit text-xl p-2`}
      >
        Console
      </main>
    </div>
  );
};
