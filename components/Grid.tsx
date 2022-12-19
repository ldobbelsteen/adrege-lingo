import { useCallback, useEffect, useMemo, useState } from "react";
import { SoundEffect } from "../utils/audio";
import { Char } from "./Lingo";

enum Color {
  CorrectLetter,
  YellowLetter,
  WrongLetter,
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Grid(props: { word: string; guesses: Char[][] }) {
  const tries = 5;
  const [colors, setColors] = useState<Color[][]>([]);
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
      const guess = props.guesses[guessIndex];
      for (let i = 0; i < guess.length; i++) {
        const letter = guess[i].char;
        const color =
          letter === props.word.charAt(i)
            ? Color.CorrectLetter
            : props.word.includes(letter)
            ? Color.YellowLetter
            : Color.WrongLetter;
        setColors((cs) => {
          const csCopy = [...cs];
          csCopy[guessIndex].push(color);
          return csCopy;
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
    },
    [soundEffects, props.guesses, props.word]
  );

  useEffect(() => {
    if (props.guesses.length > 1 && props.guesses.length - 1 > colors.length) {
      const index = colors.length;
      setColors((cs) => [...cs, []]);
      colorGuess(index).catch(console.error);
    }
  }, [colorGuess, colors, props.guesses, props.word]);

  return (
    <table>
      <tbody>
        {[...Array<number>(tries)].map((_, i) => (
          <tr key={i}>
            {[...Array<number>(props.word.length)].map((_, j) => (
              <td key={j}>
                <div className="h-24 w-24 rounded m-1 text-bordeaux text-6xl bg-white">
                  {colors[i] !== undefined &&
                    colors[i][j] === Color.YellowLetter && (
                      <div className="h-24 w-24 absolute rounded-full bg-pilsgeel"></div>
                    )}
                  {colors[i] !== undefined &&
                    colors[i][j] === Color.CorrectLetter && (
                      <div className="h-24 w-24 absolute rounded bg-turbulentie"></div>
                    )}
                  <div className="h-24 w-24 absolute flex justify-center items-center">
                    {props.guesses[i] === undefined
                      ? ""
                      : props.guesses[i][j].char === "Y"
                      ? "IJ"
                      : props.guesses[i][j].char.toUpperCase()}
                  </div>
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
