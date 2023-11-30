import React from "react";
import { Box } from "../../Box";
import { Title } from "../../Title";

export function LingoPointView(
  props:
    | {
        firstTeamPoints: number;
        secondTeamPoints: number;
      }
    | { points: number },
) {
  return (
    <Box>
      <Title text="Puntenstand" textSize="text-4xl" />
      {"points" in props ? (
        <>
          <span className="text-8xl">{props.points}</span>
        </>
      ) : (
        <div className="flex items-center justify-center">
          <div className="m-4">
            <Title text="Team 1" textSize="text-6xl" />
            <span className="text-8xl">{props.firstTeamPoints}</span>
          </div>
          <div className="m-4">
            <Title text="Team 2" textSize="text-6xl" />
            <span className="text-8xl">{props.secondTeamPoints}</span>
          </div>
        </div>
      )}
    </Box>
  );
}
