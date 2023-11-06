import React from "react";
import { LingoController } from "./LingoController/index";
import { LingoView } from "./LingoView/index";

export enum Screen {
  Start = "Startscherm",
  Guess = "Woord raden",
  EvenCard = "Kaart team 1",
  UnevenCard = "Kaart team 2",
}

const urlParams = new URLSearchParams(window.location.search);

export function Lingo() {
  return urlParams.has("isView") ? <LingoView /> : <LingoController />;
}
