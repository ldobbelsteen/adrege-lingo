import React from "react";
import logoUrl from "../../../assets/favicon.svg";
import { Box } from "../../Box";
import { Title } from "../../Title";

export function LingoStartView() {
  return (
    <Box>
      <div className="flex items-center justify-center">
        <img src={logoUrl} className="h-20 m-2"></img>
        <Title text="Adregé Lingo" textSize="text-6xl" />
      </div>
    </Box>
  );
}
