import React, { useCallback } from "react";
import { Card } from "../../../lingo";
import { lingoYellowSound } from "../../../sound";
import { Button } from "../../Button";
import { LingoCardView } from "../LingoView/LingoCardView";

export function LingoCardController(props: {
  card: Card | null;
  setCard: (c: Card | null) => void;
  teamOne: boolean;
}) {
  const toggleGrabbed = useCallback(
    (i: number, j: number) => {
      if (props.card) {
        if (!props.card.grabbed[i][j]) {
          lingoYellowSound.play().catch(console.error);
        }
        const clone = props.card.clone();
        clone.grabbed[i][j] = !props.card.grabbed[i][j];
        props.setCard(clone);
      }
    },
    [props],
  );

  return (
    <section>
      <Button
        onClick={() =>
          props.setCard(new Card(props.teamOne ? "even" : "uneven"))
        }
      >
        Nieuwe kaart
      </Button>
      <Button onClick={() => props.setCard(null)}>Verwijder kaart</Button>
      {props.card && (
        <LingoCardView
          card={props.card}
          onClick={toggleGrabbed}
          teamOne={props.teamOne}
        />
      )}
    </section>
  );
}
