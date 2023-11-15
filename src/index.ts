import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { Lingo } from "./components/Lingo/index";

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);
  root.render(createElement(Lingo));
}
