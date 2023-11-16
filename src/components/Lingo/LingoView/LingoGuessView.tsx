import React from "react";
import { Color, Guesses } from "../../../utils/lingo-guesses";
import { Title } from "../../Title";

export function LingoGuessView(props: { guesses: Guesses; teamOne: boolean }) {
  return (
    <section>
      <Title
        text={props.teamOne ? "Raden team 1" : "Raden team 2"}
        textSize="text-4xl"
      />
      <table>
        <tbody>
          {[...Array<number>(props.guesses.maxGuesses)].map((_, i) => (
            <tr key={i}>
              {[...Array<number>(props.guesses.wordLength)].map((_, j) => (
                <td key={j}>
                  <div className="h-24 w-24 rounded m-1 text-donkerrood text-6xl bg-wit">
                    {props.guesses.getColor(i, j) === Color.CorrectLocation && (
                      <div className="h-24 w-24 absolute rounded bg-oranje"></div>
                    )}
                    {props.guesses.getColor(i, j) ===
                      Color.IncorrectLocation && (
                      <div className="h-24 w-24 absolute rounded-full bg-geel"></div>
                    )}
                    <div className="h-24 w-24 absolute flex justify-center items-center">
                      {props.guesses.getChar(i, j)}
                    </div>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
