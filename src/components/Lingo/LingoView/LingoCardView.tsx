import { type Card, toggleGrabbed } from "../../../utils/card";
import { Box } from "../../Box";
import { Title } from "../../Title";

export function LingoCardView(props: {
  card: Card;
  isFirstTeamCard: boolean | null;
  setCard?: (card: Card) => void;
}) {
  return (
    <Box>
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
          {[...Array(props.card.dimensions).keys()].map((i) => (
            <tr key={i}>
              {[...Array(props.card.dimensions).keys()].map((j) => (
                <td key={j}>
                  <button
                    type="button"
                    onClick={() => {
                      if (props.setCard !== undefined) {
                        props.setCard(toggleGrabbed(props.card, i, j));
                      }
                    }}
                    style={{
                      boxShadow: "inset -25px -15px 40px rgba(0,0,0,.3)",
                    }}
                    className={`h-24 w-24 m-1 rounded-full flex justify-center items-center text-6xl text-donkerrood ${props.card.isGrabbed[i][j] ? "bg-geel" : props.card.isFavorite[i][j] ? "bg-oranje" : "bg-wit"}`}
                  >
                    {!props.card.isGrabbed[i][j] && props.card.values[i][j]}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
}
