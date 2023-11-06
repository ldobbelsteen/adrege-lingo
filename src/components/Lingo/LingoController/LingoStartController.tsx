import React from "react";
import { Button } from "../../Button";

export function LingoStartController() {
  return (
    <section>
      <Button onClick={() => localStorage.clear()}>Reset hele spel</Button>
    </section>
  );
}
