import React from "react";
import { Window } from "../Window";
import { LingoController } from "./LingoController/index";
import { LingoView } from "./LingoView/index";

const params = new URLSearchParams(window.location.search);

export enum Screen {
  Start = "Startscherm",
  Guess = "Woord raden",
  EvenCard = "Kaart team 1",
  UnevenCard = "Kaart team 2",
}

export function Lingo() {
  return (
    <>
      {params.has("isView") ? (
        <LingoView />
      ) : (
        <>
          {!params.has("disableView") && <Window url={"/?isView"} />}
          <LingoController />
        </>
      )}
    </>
  );
}
