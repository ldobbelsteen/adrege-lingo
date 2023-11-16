import React, { useCallback } from "react";
import toast from "react-hot-toast";
import { Card } from "../../../utils/lingo-card";
import { useStoredState } from "../../../utils/state-storage";
import { Button } from "../../Button";
import { LingoCardView } from "../LingoView/LingoCardView";

export function LingoCardController(props: {
  card: Card | null;
  setCard: (c: Card | null) => void;
  teamOne: boolean;
}) {
  const [cardMaxValue] = useStoredState<number>("cardMaxValue");
  const [cardDimensions] = useStoredState<number>("cardDimensions");
  const [cardPrefilled] = useStoredState<number>("cardPrefilled");

  const toggleGrabbed = useCallback(
    (i: number, j: number) => {
      if (props.card) {
        const clone = props.card.clone();
        clone.toggleGrabbed(i, j);
        props.setCard(clone);
      }
    },
    [props],
  );

  return (
    <>
      <div>
        <Button
          onClick={() => {
            if (cardMaxValue && cardDimensions && cardPrefilled) {
              props.setCard(
                new Card(
                  props.teamOne ? "even" : "uneven",
                  cardMaxValue,
                  cardDimensions,
                  cardPrefilled,
                ),
              );
              toast.success("Nieuwe kaart aangemaakt!");
            }
          }}
        >
          Nieuwe kaart
        </Button>
        <Button
          onClick={() => {
            if (props.card) {
              props.setCard(null);
              toast.error("Kaart verwijderd!");
            }
          }}
        >
          Verwijder kaart
        </Button>
      </div>

      {props.card && (
        <LingoCardView
          card={props.card}
          onClick={toggleGrabbed}
          teamOne={props.teamOne}
        />
      )}
    </>
  );
}
