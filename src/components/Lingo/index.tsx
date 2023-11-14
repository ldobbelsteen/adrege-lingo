import React from "react";
import { LingoController } from "./LingoController/index";
import { LingoView } from "./LingoView/index";

export enum Screen {
  Settings = "Instellingen",
  GuessTeamOne = "Woord raden team 1",
  GuessTeamTwo = "Woord raden team 2",
  CardTeamOne = "Lingokaart team 1",
  CardTeamTwo = "Lingokaart team 2",
}

const urlParams = new URLSearchParams(window.location.search);

export function Lingo() {
  return urlParams.has("isView") ? <LingoView /> : <LingoController />;
}
