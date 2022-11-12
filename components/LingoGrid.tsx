import { useCallback, useEffect, useState } from "react";

const playAudio = async (audio: HTMLAudioElement) => {
  return new Promise((resolve, reject) => {
    audio.onended = resolve;
    audio.play().catch(reject);
  });
};

type Audios = {
  correctLetter: HTMLAudioElement;
  wrongLocation: HTMLAudioElement;
  incorrectLetter: HTMLAudioElement;
};

export default function LingoGrid(props: { word: string; guesses: string[] }) {
  const tries = 5;

  const [guesses, setGuesses] = useState<string[]>([]);
  const [audios, setAudios] = useState<Audios>();

  useEffect(
    () =>
      setAudios(() => ({
        correctLetter: new Audio("/sounds/correct_letter.wav"),
        wrongLocation: new Audio("/sounds/wrong_location.wav"),
        incorrectLetter: new Audio("/sounds/incorrect_letter.wav"),
      })),
    []
  );

  const fillGuess = useCallback(
    async (guess: string, index: number) => {
      for (let i = 0; i < guess.length; i++) {
        const letter = guess.charAt(i);
        setGuesses((gs) => {
          const copy = [...gs];
          copy[index] += letter;
          return copy;
        });
        if (audios) {
          if (letter === props.word.charAt(i)) {
            await playAudio(audios.correctLetter);
          } else if (props.word.includes(letter)) {
            await playAudio(audios.wrongLocation);
          } else {
            await playAudio(audios.incorrectLetter);
          }
        }
      }
    },
    [props.word, audios]
  );

  useEffect(() => {
    if (props.guesses.length > guesses.length) {
      const index = guesses.length;
      setGuesses((gs) => [...gs, ""]);
      fillGuess(props.guesses[index], index).catch(console.error);
    }
  }, [props.guesses, guesses.length, fillGuess]);

  return (
    <table>
      <tbody>
        {[...Array<number>(tries)].map((_, i) => (
          <tr key={i}>
            {[...Array<number>(props.word.length)].map((_, j) => (
              <td key={j}>
                <div className="h-24 w-24 rounded m-1 bg-white text-adrege flex justify-center items-center text-6xl">
                  {guesses.at(i)?.at(j)}
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
