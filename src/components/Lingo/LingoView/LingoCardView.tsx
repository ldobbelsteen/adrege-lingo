import React from "react";
import { Card, CardDimensions } from "../../../lingo";
import { Title } from "../../Title";

export function LingoCardView(props: {
  card: Card;
  teamOne: boolean;
  onClick?: (i: number, j: number) => void;
}) {
  return (
    <div>
      <Title text={props.teamOne ? "Kaart team 1" : "Kaart team 2"} />
      <table>
        <tbody>
          {[...Array<number>(CardDimensions)].map((_, i) => (
            <tr key={i}>
              {[...Array<number>(CardDimensions)].map((_, j) => (
                <td key={j}>
                  <button
                    type="button"
                    onClick={() => props.onClick && props.onClick(i, j)}
                    className={`block h-24 w-24 m-1 rounded-full flex justify-center items-center text-donkerrood text-6xl ${
                      props.card.grabbed[i][j] ? "bg-geel" : "bg-wit"
                    }`}
                  >
                    {props.card.values[i][j]}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
