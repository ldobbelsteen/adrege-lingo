import React from "react";
import { Card } from "../../../utils/lingo-card";
import { Title } from "../../Title";

export function LingoCardView(props: {
  card: Card;
  teamOne: boolean;
  onClick?: (i: number, j: number) => void;
}) {
  return (
    <section>
      <Title
        text={props.teamOne ? "Kaart team 1" : "Kaart team 2"}
        textSize="text-4xl"
      />
      <table>
        <tbody>
          {[...Array<number>(props.card.dimensions)].map((_, i) => (
            <tr key={i}>
              {[...Array<number>(props.card.dimensions)].map((_, j) => (
                <td key={j}>
                  <button
                    type="button"
                    onClick={() => props.onClick && props.onClick(i, j)}
                    className={`block h-24 w-24 m-1 rounded-full flex justify-center items-center text-donkerrood text-6xl ${
                      props.card.isGrabbed(i, j) ? "bg-geel" : "bg-wit"
                    }`}
                  >
                    {props.card.getValue(i, j)}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
