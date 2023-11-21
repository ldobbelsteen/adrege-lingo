import React from "react";
import toast from "react-hot-toast";
import { newCard } from "../../../utils/card";
import {
  useCardDimensions,
  useCardMaxValue,
  useCardPrefilled,
  useFirstTeamCard,
  useFirstTeamCardSelected,
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
  const [firstTeamCardSelected, setFirstTeamCardSelected] =
    useFirstTeamCardSelected();

  const card = firstTeamCardSelected ? firstTeamCard : secondTeamCard;
  const setCard = firstTeamCardSelected ? setFirstTeamCard : setSecondTeamCard;

  return (
    <>
      {teamMode && (
        <div>
          <Multiselect
            selected={firstTeamCardSelected}
            setSelected={setFirstTeamCardSelected}
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
                  firstTeamCardSelected ? "even" : "uneven",
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
          isFirstTeamCard={teamMode ? firstTeamCardSelected : null}
          setCard={setCard}
        />
      )}
    </>
  );
}
