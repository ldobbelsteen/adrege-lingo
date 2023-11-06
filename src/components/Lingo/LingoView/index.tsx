import React, { useMemo } from "react";
import { Ball, Letter } from "../../../lingo";
import { useStoredState } from "../../../storage";
import { Screen } from "../index";
import { LingoCardView } from "./LingoCardView";
import { LingoGuessView } from "./LingoGuessView";
import { LingoStartView } from "./LingoStartView";

export const LingoView = () => {
  const [screen] = useStoredState<Screen>("screen");
  const [evenCard] = useStoredState<Ball[][]>("evenCard");
  const [unevenCard] = useStoredState<Ball[][]>("unevenCard");
  const [guesses] = useStoredState<Letter[][]>("guesses");

  const component = useMemo((): React.JSX.Element => {
    if (!screen) return <></>;
    switch (screen) {
      case Screen.Start: {
        return <LingoStartView />;
      }
      case Screen.Guess: {
        if (!guesses) return <></>;
        return <LingoGuessView guesses={guesses} />;
      }
      case Screen.EvenCard: {
        if (!evenCard) return <></>;
        return <LingoCardView card={evenCard} onClick={() => {}} />;
      }
      case Screen.UnevenCard: {
        if (!unevenCard) return <></>;
        return <LingoCardView card={unevenCard} onClick={() => {}} />;
      }
    }
  }, [screen, evenCard, unevenCard, guesses]);

  return (
    <div className={`w-full h-full bg-donkerrood`}>
      <main
        className={`flex flex-col items-center overflow-hidden min-h-full text-center text-wit text-xl p-2 bg-[url('../assets/sneeuw.svg')] bg-repeat-x bg-bottom`}
      >
        {component}
      </main>
    </div>
  );
};
