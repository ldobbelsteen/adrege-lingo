import React from "react";
import { LingoController } from "./LingoController/index";
import { LingoView } from "./LingoView/index";

export enum Screen {
  Settings = "Instellingen",
  Guessing = "Woord raden",
  Cards = "Lingokaarten",
  Points = "Puntenstand",
}

const urlParams = new URLSearchParams(window.location.search);

export function Lingo() {
  return urlParams.has("isView") ? <LingoView /> : <LingoController />;
}
