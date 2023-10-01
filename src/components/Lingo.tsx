import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import backgroundMusicUrl from "../assets/sounds/background_music.ogg";
import correctAnswerUrl from "../assets/sounds/correct_answer.ogg";
import correctLetterUrl from "../assets/sounds/correct_letter.ogg";
import lingoYellowUrl from "../assets/sounds/lingo_yellow.ogg";
import timeOutUrl from "../assets/sounds/time_out.ogg";
import wrongLetterUrl from "../assets/sounds/wrong_letter.ogg";
import wrongWordUrl from "../assets/sounds/wrong_word.ogg";
import yellowLetterUrl from "../assets/sounds/yellow_letter.ogg";
import { SoundEffect } from "../sound";
import Grid from "./Grid";
import Kaart, { hasLingo, initLingo } from "./Kaart";

const tries = 5;
const extraTries = 1;
const allowedLetters = "abcdefghijklmnopqrstuvwxyzY";
const audioIntervalMs = 100;
const woorden = [
  "Adten",
  "Corps",
  "Storm",
  "Kater",
  "Kerst",
  "Keizer",
  "Fundum",
  "Taphap",
  "Burger",
  "Redout",
  "Soggen",
  "Preases",
  "Brassen",
  "Lustrum",
  "Alcohol",
  "Zuipen",
  "Knorren",
  "Tweede",
  "Kwarrel",
  "Barfje",
  "Koprol",
  "Dispuut",
  "Sporten",
  "Sjaars",
  "Bezat",
  "Demos",
  "Panda",
  "Nectar",
  "Bakken",
  "Pilsje",
  "Knaks",
  "Prela",
  "Itakru",
  "Consti",
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const shuffle = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

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
      shuffle(
        woorden
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
      ),
    [],
  );

  const [extraTry, setExtraTry] = useState(false);
  const [roundFinished, setRoundFinished] = useState(true);
  const [word, setWord] = useState("");
  const [guesses, setGuesses] = useState<Letter[][]>();
  const [guessed, setGuessed] = useState<boolean[]>();
  const soundEffects = useMemo(
    () => ({
      correctAnswer: new SoundEffect(correctAnswerUrl),
      correctLetter: new SoundEffect(correctLetterUrl),
      lingoYellow: new SoundEffect(lingoYellowUrl),
      timeOut: new SoundEffect(timeOutUrl),
      wrongLetter: new SoundEffect(wrongLetterUrl),
      wrongWord: new SoundEffect(wrongWordUrl),
      yellowLetter: new SoundEffect(yellowLetterUrl),
    }),
    [],
  );
  const musicRef = useRef<HTMLAudioElement>(null);
  const [firstLingoOpen, setFirstLingoOpen] = useState(false);
  const [secondLingoOpen, setSecondLingoOpen] = useState(false);
  const [firstLingoBalls, setFirstLingoBalls] = useState(() =>
    initLingo(true, 70, 8),
  );
  const [secondLingoBalls, setSecondLingoBalls] = useState(() =>
    initLingo(false, 70, 8),
  );

  useEffect(() => {
    if (roundFinished) {
      musicRef.current?.pause();
    } else {
      void musicRef.current?.play();
    }
  }, [roundFinished]);

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
            (l, i) => l.char === word.charAt(i) && l.char === char,
          ).length;
          const color =
            char === word.charAt(i)
              ? Color.CorrectLetter
              : guessCorrectOccurrences < wordOccurrences
              ? Color.YellowLetter
              : Color.WrongLetter;
          if (char === word.charAt(i)) {
            setGuessed((gs) => {
              if (!gs) return gs;
              const copy = [...gs];
              copy[i] = true;
              return copy;
            });
          }
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
    [guesses, soundEffects, word],
  );

  useEffect(() => {
    const listener = (ev: KeyboardEvent) => {
      if (ev.key === "1") {
        if (firstLingoOpen) {
          setFirstLingoOpen(false);
        } else {
          setFirstLingoOpen(true);
        }
      } else if (ev.key === "2") {
        if (secondLingoOpen) {
          setSecondLingoOpen(false);
        } else {
          setSecondLingoOpen(true);
        }
      } else if (ev.key === "N") {
        if (firstLingoOpen) {
          setFirstLingoBalls(initLingo(true, 70, 8));
        }
        if (secondLingoOpen) {
          setSecondLingoBalls(initLingo(false, 70, 8));
        }
      } else if (ev.key === "M") {
        if (firstLingoOpen) {
          setFirstLingoBalls(initLingo(true, 70, 10));
        }
        if (secondLingoOpen) {
          setSecondLingoBalls(initLingo(false, 70, 10));
        }
      } else if (ev.key === "T") {
        void soundEffects.timeOut.play();
      } else if (ev.key === "Enter") {
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
          setGuessed(new Array(newWord.length).fill(false));
          setGuesses([firstGuess]);
          setExtraTry(false);
          setRoundFinished(false);
        } else if (guesses && guessed) {
          const last = guesses.length - 1;
          if (guesses[last].every((l, i) => word.charAt(i) === l.char)) {
            colorGuess(last)
              .then(() => {
                setRoundFinished(true);
                void soundEffects.correctAnswer.play();
                return;
              })
              .catch(console.error);
          } else if (guesses[last].every((c) => c.char !== ".")) {
            const newGuess: Letter[] = [];
            for (let i = 0; i < guesses[last].length; i++) {
              if (
                guesses[last][i].given ||
                guesses[last][i].char === word.charAt(i) ||
                guessed[i]
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
                    void soundEffects.wrongWord.play();
                  } else {
                    setRoundFinished(true);
                    void soundEffects.wrongWord.play();
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
            .findIndex((c) => c.char !== ".");
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
  }, [
    colorGuess,
    extraTry,
    guesses,
    roundFinished,
    word,
    words,
    soundEffects,
    firstLingoOpen,
    secondLingoOpen,
    guessed,
  ]);

  return (
    <div className="bg-bordeaux p-4 rounded-3xl">
      <audio loop ref={musicRef} src={backgroundMusicUrl}></audio>
      {firstLingoOpen ? (
        <Kaart
          balls={firstLingoBalls}
          setBalls={(balls) => {
            setFirstLingoBalls(balls);
            if (hasLingo(balls)) {
              void soundEffects.correctAnswer.play();
            } else {
              void soundEffects.lingoYellow.play();
            }
          }}
          title="Team 1"
        />
      ) : secondLingoOpen ? (
        <Kaart
          balls={secondLingoBalls}
          setBalls={(balls) => {
            setSecondLingoBalls(balls);
            if (hasLingo(balls)) {
              void soundEffects.correctAnswer.play();
            } else {
              void soundEffects.lingoYellow.play();
            }
          }}
          title="Team 2"
        />
      ) : (
        guesses && (
          <Grid
            wordLength={word.length}
            guesses={guesses}
            maxTries={tries + (extraTry ? extraTries : 0)}
          />
        )
      )}
    </div>
  );
}