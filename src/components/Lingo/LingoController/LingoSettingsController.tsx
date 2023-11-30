import React from "react";
import toast from "react-hot-toast";
import {
  clearStorage,
  useCardDimensions,
  useCardMaxValue,
  useCardPrefilled,
  useMaxGuesses,
  useTeamMode,
} from "../../../utils/storage";
import { Box } from "../../Box";
import { Button } from "../../Button";
import { Checkbox } from "../../Checkbox";
import { NumberInput } from "../../NumberInput";
import { Title } from "../../Title";
import { WindowToggle } from "../../WindowToggle";

export function LingoSettingsController() {
  const [cardDimensions, setCardDimensions] = useCardDimensions();
  const [cardMaxValue, setCardMaxValue] = useCardMaxValue();
  const [cardPrefilled, setCardPrefilled] = useCardPrefilled();
  const [maxGuesses, setMaxGuesses] = useMaxGuesses();
  const [teamMode, setTeamMode] = useTeamMode();

  return (
    <>
      <section>
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
      </section>
      <Box>
        <Title text="Instellingen" textSize="text-3xl" className="pb-2" />
        <div>
          <span>Teammodus</span>
          <Checkbox checked={teamMode} setChecked={setTeamMode} />
        </div>
        <div>
          <span>Afmetingen van lingokaarten</span>
          <NumberInput
            input={cardDimensions}
            setInput={setCardDimensions}
            min={3}
          />
        </div>
        <div>
          <span>Maximale waarde ballen op lingokaarten</span>
          <NumberInput
            input={cardMaxValue}
            setInput={setCardMaxValue}
            min={2 * Math.pow(cardDimensions, 2)}
          />
        </div>
        <div>
          <span>Vooraf gegeven ballen op lingokaarten</span>
          <NumberInput
            input={cardPrefilled}
            setInput={setCardPrefilled}
            min={0}
            max={Math.pow(cardDimensions, 2)}
          />
        </div>
        <div>
          <span>Maximum aantal pogingen woord raden</span>
          <NumberInput input={maxGuesses} setInput={setMaxGuesses} min={1} />
        </div>
      </Box>
    </>
  );
}
