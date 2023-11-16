import React, { useMemo } from "react";
import { Card } from "../../../utils/lingo-card";
import { Guesses } from "../../../utils/lingo-guesses";
import {
  useStoredState,
  useStoredStateWithDefault,
} from "../../../utils/state-storage";
import { Screen } from "../index";
import { LingoCardView } from "./LingoCardView";
import { LingoGuessView } from "./LingoGuessView";
import { LingoStartView } from "./LingoStartView";

export const LingoView = () => {
  const [screen] = useStoredStateWithDefault<Screen>("screen", Screen.Settings);
  const [teamOneCard] = useStoredState<Card>("teamOneCard", Card.fromJson);
  const [teamTwoCard] = useStoredState<Card>("teamTwoCard", Card.fromJson);
  const [teamOneGuesses] = useStoredState<Guesses>(
    "teamOneGuesses",
    Guesses.fromJson,
  );
  const [teamTwoGuesses] = useStoredState<Guesses>(
    "teamTwoGuesses",
    Guesses.fromJson,
  );

  const component = useMemo((): React.JSX.Element => {
    switch (screen) {
      case Screen.GuessTeamOne: {
        if (!teamOneGuesses) break;
        return <LingoGuessView guesses={teamOneGuesses} teamOne={true} />;
      }
      case Screen.GuessTeamTwo: {
        if (!teamTwoGuesses) break;
        return <LingoGuessView guesses={teamTwoGuesses} teamOne={false} />;
      }
      case Screen.CardTeamOne: {
        if (!teamOneCard) break;
        return <LingoCardView card={teamOneCard} teamOne={true} />;
      }
      case Screen.CardTeamTwo: {
        if (!teamTwoCard) break;
        return <LingoCardView card={teamTwoCard} teamOne={false} />;
      }
    }
    return <LingoStartView />;
  }, [screen, teamOneGuesses, teamTwoGuesses, teamOneCard, teamTwoCard]);

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
