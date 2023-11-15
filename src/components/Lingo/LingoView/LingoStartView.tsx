import React from "react";
import logoUrl from "../../../assets/favicon.svg";
import { Title } from "../../Title";

export function LingoStartView() {
  return (
    <section className="flex items-center justify-center">
      <img src={logoUrl} className="h-20 m-2"></img>
      <Title text="Adregé Lingo" textSize="text-6xl" />
    </section>
  );
}
