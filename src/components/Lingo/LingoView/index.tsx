import { useMemo } from "react";
import {
  useFirstTeamCard,
  useFirstTeamGuessing,
  useFirstTeamPoints,
  useFirstTeamSelected,
  useGuesses,
  useScreen,
  useSecondTeamCard,
  useSecondTeamPoints,
  useShowWord,
  useTeamMode,
} from "../../../utils/storage";
import { Screen } from "../index";
import { LingoCardView } from "./LingoCardView";
import { LingoGuessView } from "./LingoGuessView";
import { LingoPointView } from "./LingoPointView";
import { LingoStartView } from "./LingoStartView";

export const LingoView = () => {
  const [screen] = useScreen();
  const [teamMode] = useTeamMode();

  const [guesses] = useGuesses();
  const [firstTeamGuessing] = useFirstTeamGuessing();
  const [showWord] = useShowWord();

  const [firstTeamCard] = useFirstTeamCard();
  const [secondTeamCard] = useSecondTeamCard();
  const [firstTeamSelected] = useFirstTeamSelected();

  const [firstTeamPoints] = useFirstTeamPoints();
  const [secondTeamPoints] = useSecondTeamPoints();

  const card = firstTeamSelected ? firstTeamCard : secondTeamCard;

  const component = useMemo((): JSX.Element => {
    switch (screen) {
      case Screen.Guessing: {
        if (guesses) {
          return (
            <LingoGuessView
              guesses={guesses}
              firstTeamGuessing={teamMode ? firstTeamGuessing : null}
              showTargetWord={showWord}
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
              isFirstTeamCard={teamMode ? firstTeamSelected : null}
            />
          );
        }
        break;
      }
      case Screen.Points: {
        if (teamMode) {
          return (
            <LingoPointView
              firstTeamPoints={firstTeamPoints}
              secondTeamPoints={secondTeamPoints}
            />
          );
        }

        return (
          <LingoPointView
            points={firstTeamSelected ? firstTeamPoints : secondTeamPoints}
          />
        );
      }
    }
    return <LingoStartView />;
  }, [
    card,
    firstTeamSelected,
    firstTeamGuessing,
    guesses,
    screen,
    teamMode,
    firstTeamPoints,
    secondTeamPoints,
    showWord,
  ]);

  return (
    <main
      className={`w-full min-h-full p-2 flex justify-center items-center text-center text-wit text-xl bg-donkerrood bg-[url('../assets/sneeuw.svg')] bg-repeat-x bg-bottom`}
    >
      {component}
    </main>
  );
};
