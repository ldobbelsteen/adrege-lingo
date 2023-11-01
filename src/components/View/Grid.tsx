import React from "react";
import { Letter, Color } from "./Lingo";

export default function Grid(props: {
  wordLength: number;
  guesses: Letter[][];
  maxTries: number;
}) {
  return (
    <table>
      <tbody>
        {[...Array<number>(props.maxTries)].map((_, i) => (
          <tr key={i}>
            {[...Array<number>(props.wordLength)].map((_, j) => (
              <td key={j}>
                <div className="h-24 w-24 rounded m-1 text-brandweerrood text-6xl bg-wit">
                  {props.guesses[i] &&
                    props.guesses[i][j].color === Color.YellowLetter && (
                      <div className="h-24 w-24 absolute rounded-full bg-pilsgeel"></div>
                    )}
                  {props.guesses[i] &&
                    props.guesses[i][j].color === Color.CorrectLetter && (
                      <div className="h-24 w-24 absolute rounded bg-schrobbeloranje"></div>
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
