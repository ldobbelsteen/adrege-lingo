import React from "react";
import { Card } from "../../../utils/lingo-card";
import { Title } from "../../Title";

export function LingoCardView(props: {
  card: Card;
  isFirstTeamCard: boolean | null;
  setCard?: (card: Card) => void;
}) {
  const onClick = (i: number, j: number) => {
    if (props.setCard) {
      const clone = props.card.clone();
      clone.toggleGrabbed(i, j);
      props.setCard(clone);
    }
  };

  return (
    <section>
      <Title
        text={
          props.isFirstTeamCard === null
            ? "Lingokaart"
            : `Lingokaart team ${props.isFirstTeamCard ? "1" : "2"}`
        }
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
                    onClick={() => onClick(i, j)}
                    style={{
                      boxShadow: "inset -25px -15px 40px rgba(0,0,0,.3)",
                    }}
                    className={`block h-24 w-24 m-1 rounded-full flex justify-center items-center text-6xl ${
                      props.card.getIsGrabbed(i, j) ? "bg-geel" : "bg-wit"
                    } ${
                      props.card.getIsFavorite(i, j)
                        ? "text-zwart"
                        : "text-donkerrood"
                    }`}
                  >
                    {props.card.getIsGrabbed(i, j) || props.card.getValue(i, j)}
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
