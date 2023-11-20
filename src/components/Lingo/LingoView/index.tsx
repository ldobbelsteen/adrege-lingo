import React, { useMemo } from "react";
import {
  useCardIndex,
  useCards,
  useGuesses,
  useGuessingTeam,
  useScreen,
  useTeamCount,
} from "../../../utils/state-storage";
import { teamIndexToName } from "../LingoController";
import { Screen } from "../index";
import { LingoCardView } from "./LingoCardView";
import { LingoGuessView } from "./LingoGuessView";
import { LingoStartView } from "./LingoStartView";

export const LingoView = () => {
  const [screen] = useScreen();
  const [teamCount] = useTeamCount();

  const [guesses] = useGuesses();
  const [guessingTeam] = useGuessingTeam();

  const [cards] = useCards();
  const [cardIndex] = useCardIndex();
  const card = cards[cardIndex];

  const component = useMemo((): React.JSX.Element => {
    switch (screen) {
      case Screen.Guessing: {
        if (guesses) {
          return (
            <LingoGuessView
              guesses={guesses}
              team={teamCount >= 2 ? teamIndexToName(guessingTeam) : null}
            />
          );
        }
        break;
      }
      case Screen.Cards: {
        if (card) {
          return (
            <LingoCardView
              card={card}
              team={teamCount >= 2 ? teamIndexToName(cardIndex) : null}
            />
          );
        }
        break;
      }
    }
    return <LingoStartView />;
  }, [card, cardIndex, guesses, guessingTeam, screen, teamCount]);

  return (
    <main
      className={`w-full h-full text-center text-wit text-xl bg-donkerrood`}
    >
      <div
        className={`w-full h-full flex justify-center items-center p-2 bg-[url('../assets/sneeuw.svg')] bg-repeat-x bg-bottom`}
      >
        <div className={`m-2 p-4 bg-donkerderrood rounded-2xl`}>
          {component}
        </div>
      </div>
    </main>
  );
};
