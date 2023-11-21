import React, { useMemo } from "react";
import {
  useFirstTeamCard,
  useFirstTeamCardSelected,
  useFirstTeamGuessing,
  useGuesses,
  useScreen,
  useSecondTeamCard,
  useTeamMode,
} from "../../../utils/storage";
import { Screen } from "../index";
import { LingoCardView } from "./LingoCardView";
import { LingoGuessView } from "./LingoGuessView";
import { LingoStartView } from "./LingoStartView";

export const LingoView = () => {
  const [screen] = useScreen();
  const [teamMode] = useTeamMode();

  const [guesses] = useGuesses();
  const [firstTeamGuessing] = useFirstTeamGuessing();

  const [firstTeamCard] = useFirstTeamCard();
  const [secondTeamCard] = useSecondTeamCard();
  const [firstTeamCardSelected] = useFirstTeamCardSelected();

  const card = firstTeamCardSelected ? firstTeamCard : secondTeamCard;

  const component = useMemo((): React.JSX.Element => {
    switch (screen) {
      case Screen.Guessing: {
        if (guesses) {
          return (
            <LingoGuessView
              guesses={guesses}
              firstTeamGuessing={teamMode ? firstTeamGuessing : null}
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
              isFirstTeamCard={teamMode ? firstTeamCardSelected : null}
            />
          );
        }
        break;
      }
    }
    return <LingoStartView />;
  }, [
    card,
    firstTeamCardSelected,
    firstTeamGuessing,
    guesses,
    screen,
    teamMode,
  ]);

  return (
    <main
      className={`w-full min-h-full p-2 flex justify-center items-center text-center text-wit text-xl bg-donkerrood bg-[url('../assets/sneeuw.svg')] bg-repeat-x bg-bottom`}
    >
      <div className={`m-2 p-4 bg-donkerderrood rounded-2xl`}>{component}</div>
    </main>
  );
};
