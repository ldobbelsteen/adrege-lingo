import { useEffect, useState } from "react";
import wordJson from "../words.json";
import Grid from "./Grid";

const allowedLetters = "abcdefghijklmnopqrstuvwxyzY";

export type Char = {
  char: string;
  given: boolean;
};

export default function Lingo() {
  const words = wordJson.words
    .map((w) => w.toLowerCase())
    .map((w) => w.replace(/ij/g, "Y"))
    .map((w) => {
      for (const c of w) {
        if (!allowedLetters.includes(c)) {
          throw Error("invalid letter in word: " + w);
        }
      }
      return w;
    });

  const [wordIndex, setWordIndex] = useState(-1);
  const [guesses, setGuesses] = useState<Char[][]>();

  useEffect(() => {
    const listener = (ev: KeyboardEvent) => {
      const currentGuess = guesses?.at(-1);
      if (ev.key === "Enter") {
        if (guesses === undefined) {
          const newIndex = wordIndex + 1;
          setWordIndex(newIndex);
          setGuesses([
            [
              {
                char: words[newIndex].charAt(0),
                given: true,
              },
            ].concat(
              Array(words[newIndex].length - 1).fill({
                char: ".",
                given: false,
              })
            ),
          ]);
        } else if (currentGuess && !currentGuess.some((c) => c.char === ".")) {
          if (currentGuess.every((c, i) => words[wordIndex][i] === c.char)) {
            setGuesses(undefined);
          } else {
            const newGuess = [];
            for (let i = 0; i < currentGuess.length; i++) {
              if (currentGuess[i].char === words[wordIndex]) {
                newGuess.push({
                  char: currentGuess[i].char,
                  given: true,
                });
              } else {
                newGuess.push({
                  char: ".",
                  given: false,
                });
              }
            }
            setGuesses([...guesses, newGuess]);
          }
        }
      } else if (ev.key === "Backspace") {
        if (guesses && currentGuess) {
          const index = currentGuess
            .slice()
            .reverse()
            .findIndex((c) => !c.given);
          if (index > -1) {
            const copy = [...guesses];
            copy[copy.length - 1][index] = { char: ".", given: false };
            setGuesses(copy);
          }
        }
      } else if (allowedLetters.includes(ev.key)) {
        if (guesses && currentGuess) {
          const index = currentGuess.findIndex((c) => c.char === ".");
          if (index > -1) {
            const copy = [...guesses];
            copy[copy.length - 1][index] = { char: ev.key, given: false };
            setGuesses(copy);
          }
        }
      }
    };

    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, [guesses, words, wordIndex]);

  return (
    <div>{guesses && <Grid word={words[wordIndex]} guesses={guesses} />}</div>
  );
}
