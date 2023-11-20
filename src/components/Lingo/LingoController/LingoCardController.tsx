import React, { useCallback } from "react";
import toast from "react-hot-toast";
import { Card } from "../../../utils/lingo-card";
import {
  useCardDimensions,
  useCardIndex,
  useCardMaxValue,
  useCardPrefilled,
  useCards,
  useTeamCount,
} from "../../../utils/state-storage";
import { Button } from "../../Button";
import { Multiselect } from "../../Multiselect";
import { LingoCardView } from "../LingoView/LingoCardView";
import { teamIndexToName } from ".";

export function LingoCardController() {
  const [cardPrefilled] = useCardPrefilled();
  const [cardMaxValue] = useCardMaxValue();
  const [cardDimensions] = useCardDimensions();
  const [teamCount] = useTeamCount();

  const [cards, setCards] = useCards();
  const [cardIndex, setCardIndex] = useCardIndex();

  const card = cards[cardIndex];
  const setCard = useCallback(
    (newValue: Card | null) => {
      const next = [...cards];
      next[cardIndex] = newValue;
      setCards(next);
    },
    [cardIndex, cards, setCards],
  );

  return (
    <>
      {teamCount >= 2 && (
        <div>
          <Multiselect
            selected={cardIndex}
            setSelected={setCardIndex}
            options={cards.reduce(
              (acc, _, i) => ({ ...acc, [`Team ${i + 1}`]: i }),
              {},
            )}
          />
        </div>
      )}

      <div>
        {card ? (
          <Button
            onClick={() => {
              setCard(null);
              toast.error("Kaart verwijderd!");
            }}
          >
            Verwijder kaart
          </Button>
        ) : (
          <Button
            onClick={() => {
              setCard(
                new Card(
                  cardIndex % 2 === 0 ? "even" : "uneven",
                  cardMaxValue,
                  cardDimensions,
                  cardPrefilled,
                ),
              );
              toast.success("Nieuwe kaart aangemaakt!");
            }}
          >
            Nieuwe kaart
          </Button>
        )}
      </div>

      {card && (
        <LingoCardView
          card={card}
          team={teamCount >= 2 ? teamIndexToName(cardIndex) : null}
          setCard={setCard}
        />
      )}
    </>
  );
}
