import React from "react";
import { clearStorage } from "../../../storage";
import { Button } from "../../Button";
import { WindowToggle } from "../../WindowToggle";

export function LingoStartController() {
  return (
    <section>
      <Button
        onClick={() => {
          clearStorage();
          location.reload();
        }}
      >
        Reset hele spel
      </Button>
      <WindowToggle
        url="/?isView"
        openText="Kijkvenster openen"
        closeText="Kijkvenster sluiten"
      />
    </section>
  );
}
