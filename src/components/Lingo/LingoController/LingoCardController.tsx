import React, { useCallback } from "react";
import toast from "react-hot-toast";
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
          lingoYellowSound.play().catch(toast.error);
        }
        const clone = props.card.clone();
        clone.grabbed[i][j] = !props.card.grabbed[i][j];
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
            props.setCard(new Card(props.teamOne ? "even" : "uneven"));
            toast.success("Nieuwe kaart aangemaakt!");
          }}
        >
          Nieuwe kaart
        </Button>
        <Button
          onClick={() => {
            props.setCard(null);
            toast.error("Kaart verwijderd!");
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
