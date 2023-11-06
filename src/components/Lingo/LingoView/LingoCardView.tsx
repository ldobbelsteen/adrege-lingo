import React from "react";
import { Ball, LingoCardDimensions } from "../../../lingo";

export function LingoCardView(props: {
  card: Ball[][];
  onClick: (i: number, j: number) => void;
}) {
  return (
    <table>
      <tbody>
        {[...Array<number>(LingoCardDimensions)].map((_, i) => (
          <tr key={i}>
            {[...Array<number>(LingoCardDimensions)].map((_, j) => (
              <td key={j}>
                <button
                  type="button"
                  onClick={() => props.onClick(i, j)}
                  className={`block h-24 w-24 m-1 rounded-full flex justify-center items-center text-donkerrood text-6xl ${
                    props.card[i][j].grabbed ? "bg-geel" : "bg-wit"
                  }`}
                >
                  {props.card[i][j].value}
                </button>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
