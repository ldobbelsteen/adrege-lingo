import React from "react";
import { Color, type Guesses } from "../../../utils/guesses";
import { Box } from "../../Box";
import { Title } from "../../Title";

export function LingoGuessView(props: {
  guesses: Guesses;
  firstTeamGuessing: boolean | null;
  showTargetWord: boolean;
}) {
  return (
    <Box>
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
          {[...Array(props.guesses.chars.length).keys()].map((i) => (
            <tr key={i}>
              {[...Array(props.guesses.chars.length).keys()].map((j) => (
                <td key={j}>
                  <div
                    style={{
                      boxShadow: "inset 0px 0px 16px rgba(0,0,0,.4)",
                    }}
                    className="h-24 w-24 rounded m-1 text-donkerrood text-6xl bg-wit"
                  >
                    {props.guesses.colors[i][j] === Color.CorrectLocation && (
                      <div className="h-24 w-24 absolute rounded bg-oranje" />
                    )}
                    {props.guesses.colors[i][j] === Color.IncorrectLocation && (
                      <div className="h-24 w-24 absolute rounded-full bg-geel" />
                    )}
                    <div className="h-24 w-24 absolute flex justify-center items-center">
                      {props.guesses.currentRow === i &&
                      props.guesses.currentInput.length > j
                        ? props.guesses.currentInput[j]
                        : props.guesses.chars[i][j]}
                    </div>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {props.showTargetWord && (
        <div className="pt-4">
          <Title
            text={props.guesses.targetChars.join("")}
            textSize="text-6xl"
          />
        </div>
      )}
    </Box>
  );
}
