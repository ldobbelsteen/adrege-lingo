import React from "react";
import { Color, Letter } from "../../../lingo";

export function LingoGuessView(props: { guesses: Letter[][] }) {
  const maxTries = props.guesses.length;
  const wordLength = props.guesses[0].length;

  return (
    <table>
      <tbody>
        {[...Array<number>(maxTries)].map((_, i) => (
          <tr key={i}>
            {[...Array<number>(wordLength)].map((_, j) => (
              <td key={j}>
                <div className="h-24 w-24 rounded m-1 text-donkerrood text-6xl bg-wit">
                  {props.guesses[i] &&
                    props.guesses[i][j].color === Color.IncorrectLocation && (
                      <div className="h-24 w-24 absolute rounded-full bg-geel"></div>
                    )}
                  {props.guesses[i] &&
                    props.guesses[i][j].color === Color.CorrectLocation && (
                      <div className="h-24 w-24 absolute rounded bg-oranje"></div>
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
