import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import guessingMusicUrl from "../../../assets/guessing_music.ogg";
import { Guesses } from "../../../utils/lingo-guesses";
import {
  guessCorrect,
  guessOutOfTries,
  guessTimeout,
} from "../../../utils/sound-effects";
import {
  useGuesses,
  useGuessingTeam,
  useMaxGuesses,
  useTeamCount,
} from "../../../utils/state-storage";
import { Button } from "../../Button";
import { Multiselect } from "../../Multiselect";
import { Music } from "../../Music";
import { TextInputWithSubmitButton } from "../../TextInput";
import { LingoGuessView } from "../LingoView/LingoGuessView";
import { teamIndexToName } from ".";

export function LingoGuessController() {
  const [newWord, setNewWord] = useState("");
  const [maxGuesses] = useMaxGuesses();
  const [teamCount] = useTeamCount();

  const [guesses, setGuesses] = useGuesses();
  const [guessingTeam, setGuessingTeam] = useGuessingTeam();

  if (guesses) {
    return (
      <LingoGuessInstance
        guesses={guesses}
        setGuesses={setGuesses}
        guessingTeam={guessingTeam}
        setGuessingTeam={setGuessingTeam}
      />
    );
  } else {
    return (
      <>
        {teamCount >= 2 && (
          <div>
            <Multiselect
              selected={guessingTeam}
              setSelected={setGuessingTeam}
              options={[...Array(teamCount).keys()].reduce(
                (acc, teamIndex) => ({
                  ...acc,
                  [teamIndexToName(teamIndex)]: teamIndex,
                }),
                {},
              )}
            />
          </div>
        )}
        <TextInputWithSubmitButton
          autoFocus
          input={newWord}
          setInput={setNewWord}
          placeholder="Typ nieuw woord..."
          submitButtonText="Start nieuw woord"
          onSubmit={() => {
            if (newWord.length >= 3) {
              setGuesses(new Guesses(newWord, maxGuesses));
              setNewWord("");
              toast.success("Woord gestart!");
            }
          }}
        />
      </>
    );
  }
}

function LingoGuessInstance(props: {
  guesses: Guesses;
  guessingTeam: number;
  setGuessingTeam: (team: number) => void;
  setGuesses: (g: Guesses | null) => void;
}) {
  const [isFinished, setFinished] = useState(false);
  const [colorIndex, setColorIndex] = useState({
    row: -1,
    i: props.guesses.wordLength + 1,
  });

  // Start coloring animation when going to the next row.
  const { currentRow } = props.guesses;
  useEffect(() => {
    if (currentRow > 0) {
      setColorIndex({
        row: currentRow - 1,
        i: 0,
      });
    }
  }, [currentRow]);

  // Color the cell at the current index after an interval.
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (colorIndex.i < props.guesses.wordLength) {
        const clone = props.guesses.clone();
        clone.setColor(colorIndex.row, colorIndex.i);
        props.setGuesses(clone);
        setColorIndex({ ...colorIndex, i: colorIndex.i + 1 });
      }
      if (colorIndex.i === props.guesses.wordLength) {
        if (props.guesses.isFinished(colorIndex.row)) {
          setFinished(true);
          guessCorrect.play().catch(toast.error);
        } else if (colorIndex.row === props.guesses.maxGuesses - 1) {
          setFinished(true);
          guessOutOfTries.play().catch(toast.error);
        } else {
          const clone = props.guesses.clone();
          clone.fillDiscovered();
          props.setGuesses(clone);
        }
        setColorIndex({
          row: colorIndex.row,
          i: colorIndex.i + 1,
        });
      }
    }, 200);
    return () => clearTimeout(timeout);
  }, [colorIndex, props]);

  return (
    <>
      <Music playing={!isFinished} src={guessingMusicUrl} />

      <div>
        <Button
          onClick={() => {
            props.setGuesses(null);
            toast.error("Gestopt met woord!");
          }}
        >
          Stop met woord
        </Button>
        <Button
          onClick={() => {
            guessTimeout.play().catch(toast.error);
            toast.error("Tijd voorbij!");
          }}
        >
          Tijd voorbij
        </Button>
      </div>

      <TextInputWithSubmitButton
        autoFocus
        input={props.guesses.getInput()}
        setInput={(guess) => {
          if (props.guesses && !isFinished) {
            const clone = props.guesses.clone();
            clone.setInput(guess);
            props.setGuesses(clone);
          }
        }}
        placeholder="Typ poging..."
        submitButtonText="Poging insturen"
        onSubmit={() => {
          if (props.guesses) {
            const clone = props.guesses.clone();
            clone.submitInput();
            props.setGuesses(clone);
          }
        }}
      />

      <LingoGuessView
        guesses={props.guesses}
        team={teamIndexToName(props.guessingTeam)}
      />
    </>
  );
}
