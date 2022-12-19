import { Letter, Color } from "./Lingo";

export default function Grid(props: {
  word: string;
  guesses: Letter[][];
  tries: number;
}) {
  return (
    <table>
      <tbody>
        {[...Array<number>(props.tries)].map((_, i) => (
          <tr key={i}>
            {[...Array<number>(props.word.length)].map((_, j) => (
              <td key={j}>
                <div className="h-24 w-24 rounded m-1 text-bordeaux text-6xl bg-white">
                  {props.guesses[i] &&
                    props.guesses[i][j].color === Color.YellowLetter && (
                      <div className="h-24 w-24 absolute rounded-full bg-pilsgeel"></div>
                    )}
                  {props.guesses[i] &&
                    props.guesses[i][j].color === Color.CorrectLetter && (
                      <div className="h-24 w-24 absolute rounded bg-turbulentie"></div>
                    )}
                  <div className="h-24 w-24 absolute flex justify-center items-center">
                    {props.guesses[i]
                      ? props.guesses[i][j].char === "Y"
                        ? "IJ"
                        : props.guesses[i][j].char.toUpperCase()
                      : ""}
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
