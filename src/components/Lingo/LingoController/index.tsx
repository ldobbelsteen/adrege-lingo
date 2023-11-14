import React, { useMemo } from "react";
import { Card, Guesses } from "../../../lingo";
import { useStoredState, useStoredStateWithDefault } from "../../../storage";
import { Button } from "../../Button";
import { Screen } from "../index";
import { LingoCardController } from "./LingoCardController";
import { LingoGuessController } from "./LingoGuessController";
import { LingoSettingsController } from "./LingoSettingsController";

export const LingoController = () => {
  const [screen, setScreen] = useStoredStateWithDefault(
    "screen",
    Screen.Settings,
  );
  const [teamOneGuesses, setTeamOneGuesses] = useStoredState<Guesses>(
    "teamOneGuesses",
    Guesses.fromJson,
  );
  const [teamTwoGuesses, setTeamTwoGuesses] = useStoredState<Guesses>(
    "teamTwoGuesses",
    Guesses.fromJson,
  );
  const [teamOneCard, setTeamOneCard] = useStoredState<Card>(
    "teamOneCard",
    Card.fromJson,
  );
  const [teamTwoCard, setTeamTwoCard] = useStoredState<Card>(
    "teamTwoCard",
    Card.fromJson,
  );

  const component = useMemo((): React.JSX.Element => {
    switch (screen) {
      case Screen.Settings: {
        return <LingoSettingsController />;
      }
      case Screen.GuessTeamOne: {
        return (
          <LingoGuessController
            guesses={teamOneGuesses}
            setGuesses={setTeamOneGuesses}
            teamOne={true}
          />
        );
      }
      case Screen.GuessTeamTwo: {
        return (
          <LingoGuessController
            guesses={teamTwoGuesses}
            setGuesses={setTeamTwoGuesses}
            teamOne={false}
          />
        );
      }
      case Screen.CardTeamOne: {
        return (
          <LingoCardController
            card={teamOneCard}
            setCard={setTeamOneCard}
            teamOne={true}
          />
        );
      }
      case Screen.CardTeamTwo: {
        return (
          <LingoCardController
            card={teamTwoCard}
            setCard={setTeamTwoCard}
            teamOne={false}
          />
        );
      }
    }
  }, [
    screen,
    teamOneCard,
    setTeamOneCard,
    teamTwoCard,
    setTeamTwoCard,
    teamOneGuesses,
    setTeamOneGuesses,
    teamTwoGuesses,
    setTeamTwoGuesses,
  ]);

  return (
    <main className={`w-full h-full bg-donkerrood text-wit text-xl p-2`}>
      <div>
        {Object.values(Screen).map((s) => (
          <Button
            key={s}
            onClick={() => setScreen(s as Screen)}
            pressed={screen === s}
          >
            {Object.values(Screen).find((v) => v === s)}
          </Button>
        ))}
      </div>
      <div>{component}</div>
    </main>
  );
};
