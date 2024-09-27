import React from "react";
import toast from "react-hot-toast";
import { newCard } from "../../../utils/card";
import { lingoBall } from "../../../utils/sound";
import {
  useCardDimensions,
  useCardMaxValue,
  useCardPrefilled,
  useFirstTeamCard,
  useFirstTeamSelected,
  useSecondTeamCard,
  useTeamMode,
} from "../../../utils/storage";
import { Button } from "../../Button";
import { Multiselect } from "../../Multiselect";
import { LingoCardView } from "../LingoView/LingoCardView";

export function LingoCardController() {
  const [cardPrefilled] = useCardPrefilled();
  const [cardMaxValue] = useCardMaxValue();
  const [cardDimensions] = useCardDimensions();
  const [teamMode] = useTeamMode();

  const [firstTeamCard, setFirstTeamCard] = useFirstTeamCard();
  const [secondTeamCard, setSecondTeamCard] = useSecondTeamCard();
  const [firstTeamSelected, setFirstTeamSelected] = useFirstTeamSelected();

  const card = firstTeamSelected ? firstTeamCard : secondTeamCard;
  const setCard = firstTeamSelected ? setFirstTeamCard : setSecondTeamCard;

  return (
    <>
      {teamMode && (
        <div>
          <Multiselect
            selected={firstTeamSelected}
            setSelected={setFirstTeamSelected}
            options={{
              "Team 1": true,
              "Team 2": false,
            }}
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
                newCard(
                  firstTeamSelected ? "even" : "uneven",
                  cardMaxValue,
                  cardDimensions,
                  cardPrefilled,
                ),
              );
              lingoBall.play().catch((e: unknown) => {
                console.error(e);
              });
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
          isFirstTeamCard={teamMode ? firstTeamSelected : null}
          setCard={setCard}
        />
      )}
    </>
  );
}
