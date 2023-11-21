import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import guessingMusicUrl from "../../../assets/guessing_music.ogg";
import {
  Guesses,
  addBonusLetter,
  addColor,
  addRow,
  isCorrect,
  isOutOfTries,
  newGuesses,
  prefillDiscovered,
  remainingUndiscovered,
  submitInput,
  withInput,
} from "../../../utils/guesses";
import {
  guessCorrect,
  guessOutOfTries,
  guessTimeout,
} from "../../../utils/sound";
import {
  useFirstTeamGuessing,
  useGuessingStatus,
  useGuesses,
  useMaxGuesses,
  useTeamMode,
} from "../../../utils/storage";
import { Button } from "../../Button";
import { Elapsed } from "../../Elapsed";
import { Multiselect } from "../../Multiselect";
import { Music } from "../../Music";
import { TextInputWithSubmitButton } from "../../TextInput";
import { LingoGuessView } from "../LingoView/LingoGuessView";

export function LingoGuessController() {
  const [newWord, setNewWord] = useState("");
  const [maxGuesses] = useMaxGuesses();
  const [teamMode] = useTeamMode();

  const [guesses, setGuesses] = useGuesses();
  const [firstTeamGuessing, setFirstTeamGuessing] = useFirstTeamGuessing();

  if (guesses) {
    return (
      <LingoGuessInstance
        guesses={guesses}
        setGuesses={setGuesses}
        firstTeamGuessing={teamMode ? firstTeamGuessing : null}
        toggleTeamGuessing={() => setFirstTeamGuessing(!firstTeamGuessing)}
      />
    );
  } else {
    return (
      <>
        {teamMode && (
          <div>
            <span>Team aan zet: </span>
            <Multiselect
              selected={firstTeamGuessing}
              setSelected={setFirstTeamGuessing}
              options={{
                "Team 1": true,
                "Team 2": false,
              }}
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
              setGuesses(newGuesses(newWord, maxGuesses));
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
  setGuesses: (g: Guesses | null) => void;
  firstTeamGuessing: boolean | null;
  toggleTeamGuessing: () => void;
}) {
  const [status, setStatus] = useGuessingStatus();
  const [startTime, setStartTime] = useState(new Date());
  const [colorIndex, setColorIndex] = useState({
    i: -1,
    j: props.guesses.targetChars.length + 1,
  });

  useEffect(() => {
    if (status === "running") {
      setStartTime(new Date());
    }
  }, [status]);

  // Set status to running when the word changes
  useEffect(() => {
    setStatus("running");
  }, [props.guesses.targetChars, setStatus]);

  // Start coloring animation when going to the next row.
  useEffect(() => {
    if (props.guesses.currentRow > 0) {
      setColorIndex({
        i: props.guesses.currentRow - 1,
        j: 0,
      });
    }
  }, [props.guesses.currentRow]);

  // Color the cell at the current index after an interval.
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (colorIndex.j < props.guesses.targetChars.length) {
        props.setGuesses(addColor(props.guesses, colorIndex.i, colorIndex.j));
      } else if (colorIndex.j === props.guesses.targetChars.length) {
        if (isCorrect(props.guesses)) {
          if (status === "running") {
            guessCorrect.play().catch(toast.error);
            setStatus("finished");
          }
        } else if (isOutOfTries(props.guesses)) {
          if (status === "running") {
            guessOutOfTries.play().catch(toast.error);
            setStatus("paused");
          }
        } else if (status === "running") {
          props.setGuesses(prefillDiscovered(props.guesses));
        }
      }
      setColorIndex({ ...colorIndex, j: colorIndex.j + 1 });
    }, 200);
    return () => clearTimeout(timeout);
  }, [colorIndex, props, setStatus, status]);

  return (
    <>
      <Music playing={status === "running"} src={guessingMusicUrl} />

      <div>
        <Button
          onClick={() => {
            props.setGuesses(null);
            toast.error("Woord verwijderd!");
          }}
        >
          Verwijder woord
        </Button>

        {status === "running" && (
          <>
            <Elapsed start={startTime} />
            <Button
              onClick={() => {
                setStatus("paused");
                guessTimeout.play().catch(toast.error);
                toast.error("Tijd voorbij!");
              }}
            >
              Tijd voorbij / fout woord
            </Button>
          </>
        )}

        {status === "paused" && (
          <>
            <Button
              onClick={() => {
                let next = props.guesses;
                if (isOutOfTries(next)) {
                  next = addRow(next);
                }
                next = prefillDiscovered(next);
                next = withInput(next, "");
                props.setGuesses(next);
                setStatus("running");
              }}
            >
              Extra kans
            </Button>
            <Button
              onClick={() => {
                props.toggleTeamGuessing();
                let next = props.guesses;
                if (isOutOfTries(next)) {
                  next = addRow(next);
                }
                if (remainingUndiscovered(next) >= 2) {
                  next = addBonusLetter(next);
                }
                next = prefillDiscovered(next);
                next = withInput(next, "");
                props.setGuesses(next);
                setStatus("running");
              }}
            >
              Beurt naar andere team (met bonusletter)
            </Button>
          </>
        )}
      </div>

      <TextInputWithSubmitButton
        autoFocus
        input={props.guesses.currentInput.join("")}
        setInput={(guess) => {
          if (status === "running") {
            props.setGuesses(withInput(props.guesses, guess));
          }
        }}
        placeholder="Typ poging..."
        submitButtonText="Poging insturen"
        onSubmit={() => {
          if (props.guesses) {
            props.setGuesses(submitInput(props.guesses));
          }
        }}
      />

      <LingoGuessView
        guesses={props.guesses}
        firstTeamGuessing={props.firstTeamGuessing}
      />
    </>
  );
}
