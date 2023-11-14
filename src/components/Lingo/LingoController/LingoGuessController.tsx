import React, { useState } from "react";
import { Guesses } from "../../../lingo";
import { Button } from "../../Button";
import { Input } from "../../Input";
import { LingoGuessView } from "../LingoView/LingoGuessView";

export function LingoGuessController(props: {
  guesses: Guesses | null;
  setGuesses: (g: Guesses | null) => void;
  teamOne: boolean;
}) {
  const [newWord, setNewWord] = useState("");
  const { guesses } = props;

  return (
    <section>
      {guesses ? (
        <>
          <Button onClick={() => props.setGuesses(null)}>
            Verwijder woord
          </Button>
          <Input
            placeholder="Typ poging..."
            input={guesses.currentGuessInput.join("")}
            setInput={(guess) => {
              const clone = guesses.clone();
              clone.setCurrentGuessInput(guess);
              props.setGuesses(clone);
            }}
          />
          <Button
            onClick={() => {
              const clone = guesses.clone();
              clone.submitCurrentGuessInput();
              props.setGuesses(clone);
            }}
          >
            Poging insturen
          </Button>
          <LingoGuessView guesses={guesses} teamOne={props.teamOne} />
        </>
      ) : (
        <>
          <Input
            placeholder="Typ nieuw woord..."
            input={newWord}
            setInput={setNewWord}
          />
          <Button
            onClick={() => {
              if (newWord.length >= 3) {
                props.setGuesses(new Guesses(newWord));
                setNewWord("");
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
