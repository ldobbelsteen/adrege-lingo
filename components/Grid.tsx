import { useCallback, useEffect, useState } from "react";

enum Color {
  CorrectLetter,
  WrongLocation,
  IncorrectLetter,
}

type Audios = {
  correctLetter: HTMLAudioElement;
  wrongLocation: HTMLAudioElement;
  incorrectLetter: HTMLAudioElement;
};

const playAudio = async (audio: HTMLAudioElement) => {
  return new Promise((resolve, reject) => {
    audio.onended = resolve;
    audio.play().catch(reject);
  });
};

export default function Grid(props: { word: string; guesses: string[] }) {
  const tries = 5;
  const [audios, setAudios] = useState<Audios>();
  const [colorized, setColorized] = useState<Color[][]>([]);

  useEffect(
    () =>
      setAudios(() => ({
        correctLetter: new Audio("/sounds/correct_letter.wav"),
        wrongLocation: new Audio("/sounds/wrong_location.wav"),
        incorrectLetter: new Audio("/sounds/incorrect_letter.wav"),
      })),
    []
  );

  const colorize = useCallback(
    async (index: number) => {
      const guess = props.guesses[index];
      for (let i = 0; i < guess.length; i++) {
        const letter = guess.charAt(i);
        const color =
          letter === props.word.charAt(i)
            ? Color.CorrectLetter
            : props.word.includes(letter)
            ? Color.WrongLocation
            : Color.IncorrectLetter;
        setColorized((cs) => {
          const copy = [...cs];
          copy[index].push(color);
          return copy;
        });
        if (audios) {
          switch (color) {
            case Color.CorrectLetter:
              await playAudio(audios.correctLetter);
              break;
            case Color.WrongLocation:
              await playAudio(audios.wrongLocation);
              break;
            case Color.IncorrectLetter:
              await playAudio(audios.incorrectLetter);
          }
        }
      }
    },
    [audios, props.guesses, props.word]
  );

  useEffect(() => {
    if (
      props.guesses.length > 1 &&
      props.guesses.length - 1 > colorized.length
    ) {
      const index = colorized.length;
      setColorized((cs) => [...cs, []]);
      colorize(index).catch(console.error);
    }
  }, [colorize, colorized, props.guesses, props.word]);

  return (
    <table>
      <tbody>
        {[...Array<number>(tries)].map((_, i) => (
          <tr key={i}>
            {[...Array<number>(props.word.length)].map((_, j) => (
              <td key={j}>
                <div className="h-24 w-24 rounded m-1 text-adrege text-6xl bg-white">
                  {colorized[i] !== undefined &&
                    colorized[i][j] === Color.WrongLocation && (
                      <div className="h-24 w-24 absolute rounded-full bg-pilsgeel"></div>
                    )}
                  {colorized[i] !== undefined &&
                    colorized[i][j] === Color.CorrectLetter && (
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
