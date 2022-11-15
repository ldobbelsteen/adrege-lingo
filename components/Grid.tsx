import { useCallback, useEffect, useMemo, useState } from "react";
import { SoundEffect } from "../utils/audio";

enum Color {
  CorrectLetter,
  WrongLocation,
  IncorrectLetter,
}

export default function Grid(props: { word: string; guesses: string[] }) {
  const tries = 5;
  const [colors, setColors] = useState<Color[][]>([]);
  const soundEffects = useMemo(
    () => ({
      correctLetter: new SoundEffect("/sounds/correct_letter.wav"),
      wrongLocation: new SoundEffect("/sounds/wrong_location.wav"),
      incorrectLetter: new SoundEffect("/sounds/incorrect_letter.wav"),
    }),
    []
  );

  const colorGuess = useCallback(
    async (guessIndex: number) => {
      const guess = props.guesses[guessIndex];
      for (let i = 0; i < guess.length; i++) {
        const letter = guess.charAt(i);
        const color =
          letter === props.word.charAt(i)
            ? Color.CorrectLetter
            : props.word.includes(letter)
            ? Color.WrongLocation
            : Color.IncorrectLetter;
        setColors((cs) => {
          const csCopy = [...cs];
          csCopy[guessIndex].push(color);
          return csCopy;
        });
        switch (color) {
          case Color.CorrectLetter:
            await soundEffects.correctLetter.play();
            break;
          case Color.WrongLocation:
            await soundEffects.wrongLocation.play();
            break;
          case Color.IncorrectLetter:
            await soundEffects.incorrectLetter.play();
        }
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
                    colors[i][j] === Color.WrongLocation && (
                      <div className="h-24 w-24 absolute rounded-full bg-pilsgeel"></div>
                    )}
                  {colors[i] !== undefined &&
                    colors[i][j] === Color.CorrectLetter && (
                      <div className="h-24 w-24 absolute rounded bg-turbulentie"></div>
                    )}
                  <div className="h-24 w-24 absolute flex justify-center items-center">
                    {props.guesses[i] === undefined
                      ? ""
                      : props.guesses[i][j] === "Y"
                      ? "IJ"
                      : props.guesses[i][j]?.toUpperCase() || "."}
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
