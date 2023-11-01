import React from "react";
import { createRoot } from "react-dom/client";
import { Console } from "./Console";
import { View } from "./View";

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);
  const params = new URLSearchParams(window.location.search);
  if (params.has("view")) {
    root.render(<View />);
  } else {
    root.render(<Console />);
  }
}
