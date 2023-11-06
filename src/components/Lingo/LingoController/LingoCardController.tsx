import React from "react";
import { randomCard } from "../../../lingo";
import { copyNested } from "../../../misc";
import { lingoYellowSound } from "../../../sound";
import { useStoredStateWithDefault } from "../../../storage";
import { Button } from "../../Button";
import { LingoCardView } from "../LingoView/LingoCardView";

export function LingoCardController(props: { type: "even" | "uneven" }) {
  const [card, setCard] = useStoredStateWithDefault(
    props.type + "Card",
    randomCard(props.type),
  );

  const toggleGrabbed = (i: number, j: number) => {
    if (card) {
      if (!card[i][j].grabbed) {
        lingoYellowSound.play().catch(console.error);
      }
      const newCard = copyNested(card);
      newCard[i][j] = { ...newCard[i][j], grabbed: !newCard[i][j].grabbed };
      setCard(newCard);
    }
  };

  return (
    <section>
      <Button onClick={() => setCard(randomCard(props.type))}>
        Nieuwe kaart
      </Button>
      {card && <LingoCardView card={card} onClick={toggleGrabbed} />}
    </section>
  );
}
