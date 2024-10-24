import { LingoController } from "./LingoController/index";
import { LingoView } from "./LingoView/index";

export const innerShadow = "inset 0px 0px 8px rgba(0,0,0,.4)";

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
