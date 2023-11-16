import React, { useMemo } from "react";
import { Toaster } from "react-hot-toast";
import { Card } from "../../../utils/lingo-card";
import { Guesses } from "../../../utils/lingo-guesses";
import {
  useStoredState,
  useStoredStateWithDefault,
} from "../../../utils/state-storage";
import { Button } from "../../Button";
import { Title } from "../../Title";
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
    <main
      className={`w-full h-full text-center text-wit text-xl bg-donkerrood`}
    >
      <Toaster position="top-right" />
      <div className="flex justify-center items-center bg-donkerderrood p-2">
        <Title
          text="Lingo controlepaneel"
          textSize="text-2xl"
          className="mx-4"
        />
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
      <div className="flex flex-col justify-center items-center p-2 gap-1">
        {component}
      </div>
    </main>
  );
};
