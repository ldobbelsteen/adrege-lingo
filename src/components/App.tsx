import React from "react";
import { createRoot } from "react-dom/client";
import Lingo from "./Lingo";

const App = () => {
  return (
    <div
      className={`w-full h-full bg-[url('../assets/tornado.svg')] bg-no-repeat bg-right bg-contain bg-bordeaux`}
    >
      <main
        className={`flex flex-col items-center overflow-hidden min-h-full text-center text-white text-xl p-2 bg-[url('../assets/sneeuw.svg')] bg-repeat-x bg-bottom`}
      >
        <Lingo />
      </main>
    </div>
  );
};

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
