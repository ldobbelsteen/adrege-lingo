import { useCallback, useEffect, useMemo, useState } from "react";
import { SoundEffect } from "../utils/audio";
import wordJson from "../words.json";
import Grid from "./Grid";

const tries = 5;

const allowedLetters = "abcdefghijklmnopqrstuvwxyzY";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type Letter = {
  char: string;
  given: boolean;
  color: Color;
};

export enum Color {
  CorrectLetter,
  YellowLetter,
  WrongLetter,
  None,
}

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

  const [opponentTry, setOpponentTry] = useState(false);
  const [wordFinished, setWordFinished] = useState(true);
  const [wordIndex, setWordIndex] = useState(-1);
  const [guesses, setGuesses] = useState<Letter[][]>();
  const soundEffects = useMemo(
    () => ({
      backgroundMusic: new SoundEffect("/sounds/background_music.ogg"),
      correctAnswer: new SoundEffect("/sounds/correct_answer.ogg"),
      correctLetter: new SoundEffect("/sounds/correct_letter.ogg"),
      lingoYellow: new SoundEffect("/sounds/lingo_yellow.ogg"),
      timeOut: new SoundEffect("/sounds/time_out.ogg"),
      wrongLetter: new SoundEffect("/sounds/wrong_letter.ogg"),
      wrongWord: new SoundEffect("/sounds/wrong_word.ogg"),
      yellowLetter: new SoundEffect("/sounds/yellow_letter.ogg"),
    }),
    []
  );

  const colorGuess = useCallback(
    async (guessIndex: number) => {
      if (guesses) {
        const guess = guesses[guessIndex];
        for (let i = 0; i < guess.length; i++) {
          const char = guess[i].char;
          const color =
            char === words[wordIndex].charAt(i)
              ? Color.CorrectLetter
              : guess.filter(
                  (l, i) =>
                    l.char === words[wordIndex].charAt(i) && l.char === char
                ).length <
                words[wordIndex].split("").filter((c) => c === char).length
              ? Color.YellowLetter
              : Color.WrongLetter;
          setGuesses((gs) => {
            if (!gs) return undefined;
            const copy = [...gs];
            copy[guessIndex][i] = { ...copy[guessIndex][i], color: color };
            return copy;
          });
          switch (color) {
            case Color.CorrectLetter:
              await soundEffects.correctLetter.play();
              break;
            case Color.YellowLetter:
              await soundEffects.yellowLetter.play();
              break;
            case Color.WrongLetter:
              await soundEffects.wrongLetter.play();
          }
          await sleep(100);
        }
      }
    },
    [guesses, soundEffects, words, wordIndex]
  );

  useEffect(() => {
    const listener = (ev: KeyboardEvent) => {
      if (ev.key === "Enter") {
        if (wordFinished) {
          const newIndex = wordIndex + 1;
          const firstGuess = [
            {
              char: words[newIndex].charAt(0),
              given: true,
              color: Color.None,
            },
          ];
          for (let i = 0; i < words[newIndex].length - 1; i++) {
            firstGuess.push({
              char: ".",
              given: false,
              color: Color.None,
            });
          }
          setWordIndex(newIndex);
          setGuesses([firstGuess]);
          setOpponentTry(false);
          setWordFinished(false);
        } else if (guesses !== undefined) {
          if (
            guesses[guesses.length - 1].every(
              (c, i) => words[wordIndex].charAt(i) === c.char
            )
          ) {
            void colorGuess(guesses.length - 1);
            setWordFinished(true);
          } else if (guesses[guesses.length - 1].every((c) => c.char !== ".")) {
            const newGuess: Letter[] = [];
            const currentGuess = guesses[guesses.length - 1];
            for (let i = 0; i < currentGuess.length; i++) {
              if (
                currentGuess[i].given ||
                currentGuess[i].char === words[wordIndex].charAt(i)
              ) {
                newGuess.push({
                  char: currentGuess[i].char,
                  given: true,
                  color: Color.None,
                });
              } else {
                newGuess.push({
                  char: ".",
                  given: false,
                  color: Color.None,
                });
              }
            }
            const maxTries = guesses.length >= tries + (opponentTry ? 1 : 0);
            colorGuess(guesses.length - 1)
              .then(() => {
                setGuesses((gs) => {
                  if (!gs) return undefined;
                  return [...gs, newGuess];
                });
                if (maxTries) {
                  if (!opponentTry) {
                    setOpponentTry(true);
                  } else {
                    setWordFinished(true);
                  }
                }
                return;
              })
              .catch(console.error);
          }
        }
      } else if (ev.key === "Backspace") {
        const currentGuess = guesses?.at(-1);
        if (guesses && currentGuess) {
          const index = currentGuess
            .slice()
            .reverse()
            .findIndex((c) => c.char !== "." && !c.given);
          if (index > -1) {
            const reversedIndex = currentGuess.length - index - 1;
            const copy = [...guesses];
            copy[copy.length - 1][reversedIndex] = {
              char: ".",
              given: false,
              color: Color.None,
            };
            setGuesses(copy);
          }
        }
      } else if (allowedLetters.includes(ev.key)) {
        const currentGuess = guesses?.at(-1);
        if (guesses && currentGuess) {
          const index = currentGuess.findIndex((c) => c.char === ".");
          if (index > -1) {
            const copy = [...guesses];
            copy[copy.length - 1][index] = {
              char: ev.key,
              given: false,
              color: Color.None,
            };
            setGuesses(copy);
          }
        }
      }
    };

    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, [guesses, words, wordIndex, colorGuess, opponentTry, wordFinished]);

  return (
    <div>
      {guesses && (
        <Grid
          word={words[wordIndex]}
          guesses={guesses}
          tries={opponentTry ? tries + 1 : tries}
        />
      )}
    </div>
  );
}
