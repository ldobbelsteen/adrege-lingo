import { useCallback, useEffect, useMemo, useState } from "react";
import { SoundEffect } from "../utils/audio";
import wordJson from "../words.json";
import Grid from "./Grid";

const tries = 5;
const extraTries = 1;
const allowedLetters = "abcdefghijklmnopqrstuvwxyzY";
const audioIntervalMs = 100;

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
  const words = useMemo(
    () =>
      wordJson.words
        .map((w) => w.toLowerCase())
        .map((w) => w.replace(/ij/g, "Y"))
        .map((w) => {
          for (const c of w) {
            if (!allowedLetters.includes(c)) {
              throw Error("invalid letter in word: " + w);
            }
          }
          return w;
        }),
    []
  );

  const [extraTry, setExtraTry] = useState(false);
  const [roundFinished, setRoundFinished] = useState(true);
  const [word, setWord] = useState("");
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
          const wordOccurrences = word
            .split("")
            .filter((c) => c === char).length;
          const guessCorrectOccurrences = guess.filter(
            (l, i) => l.char === word.charAt(i) && l.char === char
          ).length;
          const color =
            char === word.charAt(i)
              ? Color.CorrectLetter
              : guessCorrectOccurrences < wordOccurrences
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
          await sleep(audioIntervalMs);
        }
      }
    },
    [guesses, soundEffects, word]
  );

  useEffect(() => {
    const listener = (ev: KeyboardEvent) => {
      if (ev.key === "Enter") {
        if (roundFinished) {
          const newWordIndex = words.indexOf(word) + 1;
          const newWord = words[newWordIndex];
          const firstGuess = [
            {
              char: newWord.charAt(0),
              given: true,
              color: Color.None,
            },
          ];
          for (let i = 0; i < newWord.length - 1; i++) {
            firstGuess.push({
              char: ".",
              given: false,
              color: Color.None,
            });
          }
          setWord(newWord);
          setGuesses([firstGuess]);
          setExtraTry(false);
          setRoundFinished(false);
        } else if (guesses) {
          const last = guesses.length - 1;
          if (guesses[last].every((l, i) => word.charAt(i) === l.char)) {
            void colorGuess(last);
            setRoundFinished(true);
          } else if (guesses[last].every((c) => c.char !== ".")) {
            const newGuess: Letter[] = [];
            for (let i = 0; i < guesses[last].length; i++) {
              if (
                guesses[last][i].given ||
                guesses[last][i].char === word.charAt(i)
              ) {
                newGuess.push({
                  char: word.charAt(i),
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
            const maxTries =
              guesses.length >= tries + (extraTry ? extraTries : 0);
            colorGuess(last)
              .then(() => {
                setGuesses((gs) => {
                  if (!gs) return undefined;
                  return [...gs, newGuess];
                });
                if (maxTries) {
                  if (!extraTry) {
                    setExtraTry(true);
                  } else {
                    setRoundFinished(true);
                  }
                }
                return;
              })
              .catch(console.error);
          }
        }
      } else if (ev.key === "Backspace") {
        if (guesses) {
          const last = guesses.length - 1;
          const reverseIndex = guesses[last]
            .slice()
            .reverse()
            .findIndex((c) => c.char !== "." && !c.given);
          if (reverseIndex > -1) {
            const index = word.length - 1 - reverseIndex;
            const copy = [...guesses];
            copy[last][index] = {
              char: ".",
              given: false,
              color: Color.None,
            };
            setGuesses(copy);
          }
        }
      } else if (allowedLetters.includes(ev.key)) {
        if (guesses) {
          const last = guesses.length - 1;
          const index = guesses[last].findIndex((c) => c.char === ".");
          if (index > -1) {
            const copy = [...guesses];
            copy[last][index] = {
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
  }, [colorGuess, extraTry, guesses, roundFinished, word, words]);

  return (
    <div>
      {guesses && (
        <Grid
          wordLength={word.length}
          guesses={guesses}
          maxTries={tries + (extraTry ? extraTries : 0)}
        />
      )}
    </div>
  );
}
