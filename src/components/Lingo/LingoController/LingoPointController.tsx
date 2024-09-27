import React from "react";
import { letterCorrectLocation } from "../../../utils/sound";
import {
  useFirstTeamGuessing,
  useFirstTeamPoints,
  useSecondTeamPoints,
  useTeamMode,
} from "../../../utils/storage";
import { Button } from "../../Button";
import { Title } from "../../Title";
import { LingoPointView } from "../LingoView/LingoPointView";

export function LingoPointController() {
  const [firstTeamPoints, setFirstTeamPoints] = useFirstTeamPoints();
  const [secondTeamPoints, setSecondTeamPoints] = useSecondTeamPoints();
  const [firstTeamSelected] = useFirstTeamGuessing();

  const [teamMode] = useTeamMode();

  return (
    <>
      {teamMode ? (
        <div className="flex justify-center items-center gap-4">
          <PointControlButtons
            title="Team 1"
            setPoints={setFirstTeamPoints}
            points={firstTeamPoints}
          />
          <PointControlButtons
            title="Team 2"
            setPoints={setSecondTeamPoints}
            points={secondTeamPoints}
          />
        </div>
      ) : firstTeamSelected ? (
        <PointControlButtons
          setPoints={setFirstTeamPoints}
          points={firstTeamPoints}
        />
      ) : (
        <PointControlButtons
          setPoints={setSecondTeamPoints}
          points={secondTeamPoints}
        />
      )}
      {teamMode ? (
        <LingoPointView
          firstTeamPoints={firstTeamPoints}
          secondTeamPoints={secondTeamPoints}
        />
      ) : (
        <LingoPointView
          points={firstTeamSelected ? firstTeamPoints : secondTeamPoints}
        />
      )}
    </>
  );
}

function PointControlButtons(props: {
  title?: string;
  points: number;
  setPoints: (p: number) => void;
}) {
  return (
    <div className="flex flex-col">
      {props.title && <Title text={props.title} textSize="text-4xl" />}
      <Button
        onClick={() => {
          props.setPoints(props.points + 1);
          letterCorrectLocation.play().catch((e: unknown) => {
            console.error(e);
          });
        }}
      >
        Voeg 1 punt toe
      </Button>
      <Button
        onClick={() => {
          props.setPoints(0);
        }}
      >
        Reset punten
      </Button>
    </div>
  );
}
