import React, { useMemo } from "react";
import { useStoredStateWithDefault } from "../../../storage";
import { Button } from "../../Button";
import { Screen } from "../index";
import { LingoCardController } from "./LingoCardController";
import { LingoGuessController } from "./LingoGuessController";
import { LingoStartController } from "./LingoStartController";

export const LingoController = () => {
  const [screen, setScreen] = useStoredStateWithDefault("screen", Screen.Start);

  const screenComponent = useMemo((): React.JSX.Element => {
    switch (screen) {
      case Screen.Start: {
        return <LingoStartController />;
      }
      case Screen.Guess: {
        return <LingoGuessController />;
      }
      case Screen.EvenCard: {
        return <LingoCardController type="even" />;
      }
      case Screen.UnevenCard: {
        return <LingoCardController type="uneven" />;
      }
    }
  }, [screen]);

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
      <div>{screenComponent}</div>
    </main>
  );
};
