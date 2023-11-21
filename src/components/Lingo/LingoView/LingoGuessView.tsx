import React from "react";
import { Color, Guesses } from "../../../utils/guesses";
import { Title } from "../../Title";

export function LingoGuessView(props: {
  guesses: Guesses;
  firstTeamGuessing: boolean | null;
}) {
  return (
    <section>
      <Title
        text={
          props.firstTeamGuessing === null
            ? "Woord raden"
            : `Woord raden team ${props.firstTeamGuessing ? "1" : "2"}`
        }
        textSize="text-4xl"
      />
      <table>
        <tbody>
          {[...Array<number>(props.guesses.chars.length)].map((_, i) => (
            <tr key={i}>
              {[...Array<number>(props.guesses.targetChars.length)].map(
                (_, j) => (
                  <td key={j}>
                    <div
                      style={{
                        boxShadow: "inset 0px 0px 16px rgba(0,0,0,.4)",
                      }}
                      className="h-24 w-24 rounded m-1 text-donkerrood text-6xl bg-wit"
                    >
                      {props.guesses.colors[i][j] === Color.CorrectLocation && (
                        <div className="h-24 w-24 absolute rounded bg-oranje"></div>
                      )}
                      {props.guesses.colors[i][j] ===
                        Color.IncorrectLocation && (
                        <div className="h-24 w-24 absolute rounded-full bg-geel"></div>
                      )}
                      <div className="h-24 w-24 absolute flex justify-center items-center">
                        {props.guesses.currentRow === i &&
                        props.guesses.currentInput.length > j
                          ? props.guesses.currentInput[j]
                          : props.guesses.chars[i][j]}
                      </div>
                    </div>
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
