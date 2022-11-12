import { useEffect, useState } from "react";
import Grid from "./Grid";

const allowedLetters = "abcdefghijklmnopqrstuvwxyzY";
const rawWords =
  "Adten, Bezat, Zweet, Wonen, Thema, Penis, Laffe, Samen, Corps, Drugs, Drank, Demos, Kroeg, Dwaas, Delft, Draak, Storm, Leden, Faust, Conjo, Penno, Groen, Kloot, Maagd, Naakt, Keizer, Tappen, Zuipen, Huizen, Fundum, Vouwen, Nectar, Borrel, Reizen, Studie, Taphap, Burger, Sjaars, Hertje, Adrege, Vestje, Vagina, Buikpijn, Drinken, Druppel, Praeses, Brassen";

export default function Lingo() {
  const words = rawWords
    .replace(/\s/g, "")
    .split(",")
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
  const [guesses, setGuesses] = useState<string[]>();

  useEffect(() => {
    const listener = (ev: KeyboardEvent) => {
      if (ev.key === "Enter") {
        if (guesses === undefined) {
          const newIndex = wordIndex + 1;
          setWordIndex(newIndex);
          setGuesses([words[newIndex].charAt(0)]);
        } else {
          if (guesses[guesses.length - 1].length === words[wordIndex].length) {
            setGuesses([...guesses, words[wordIndex].charAt(0)]);
          }
        }
      } else if (ev.key === "Backspace") {
        if (
          guesses &&
          guesses.length > 0 &&
          guesses[guesses.length - 1].length > 1
        ) {
          const copy = [...guesses];
          copy[copy.length - 1] = copy[copy.length - 1].slice(0, -1);
          setGuesses(copy);
        }
      } else if (allowedLetters.includes(ev.key)) {
        if (
          guesses &&
          guesses.length > 0 &&
          guesses[guesses.length - 1].length < words[wordIndex].length
        ) {
          const copy = [...guesses];
          copy[copy.length - 1] += ev.key;
          setGuesses(copy);
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
