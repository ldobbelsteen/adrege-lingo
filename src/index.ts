import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { Lingo } from "./components/Lingo/index";
import { Card } from "./lingo";

const container = document.getElementById("root");

if (container) {
  console.log(new Card("even"));
  const root = createRoot(container);
  root.render(createElement(Lingo));
}
