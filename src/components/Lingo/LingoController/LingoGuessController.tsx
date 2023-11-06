import React, { useEffect, useState } from "react";
import { Letter, createEmptyGuessGrid } from "../../../lingo";
import { useStoredState } from "../../../storage";
import { Button } from "../../Button";
import { LingoGuessView } from "../LingoView/LingoGuessView";

export function LingoGuessController() {
  const [word, setWord] = useStoredState<string>("word");
  const [guesses, setGuesses] = useStoredState<Letter[][]>("guesses");
  const [newWord, setNewWord] = useState("");

  useEffect(() => {
    if (word === null) {
      setGuesses(null);
    } else {
      setGuesses(createEmptyGuessGrid(word, 5));
    }
  }, [word, setGuesses]);

  return (
    <section>
      {guesses ? (
        <>
          <Button onClick={() => setWord(null)}>Annuleer woord</Button>
          <LingoGuessView guesses={guesses} />
        </>
      ) : (
        <>
          <input
            type="text"
            value={newWord}
            onChange={(ev) => setNewWord(ev.target.value)}
            className="text-donkerderrood rounded m-1 p-2"
          />
          <Button
            onClick={() => {
              if (newWord.length > 1) {
                setWord(newWord);
              }
            }}
          >
            Start woord
          </Button>
        </>
      )}
    </section>
  );
}
