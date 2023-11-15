import React from "react";
import toast from "react-hot-toast";
import { clearStorage } from "../../../storage";
import { Button } from "../../Button";
import { WindowToggle } from "../../WindowToggle";

export function LingoSettingsController() {
  return (
    <>
      <div className="max-w-2xl">
        Welkom bij het controlepaneel! Hieronder open je het venster waar de
        speler op meekijkt. De speler krijgt minder te zien dan hier in het
        controlepaneel. Als je boven in het menu naar een ander onderdeel
        wisselt, gaat het kijkvenster ook mee (mits er iets te zien valt).
      </div>
      <WindowToggle url="/?isView" windowName="Kijkvenster" />
      <Button
        onClick={() => {
          clearStorage();
          toast.success("Spel gereset!");
          setTimeout(() => {
            window.location.reload();
          }, 750);
        }}
      >
        Reset hele spel
      </Button>
    </>
  );
}
