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
  useFirstTeamGuessing,
  useGuessingStatus,
  useGuesses,
  useMaxGuesses,
  useTeamMode,
} from "../../../utils/state-storage";
import { Button } from "../../Button";
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
  setGuesses: (g: Guesses | null) => void;
  firstTeamGuessing: boolean | null;
  toggleTeamGuessing: () => void;
}) {
  const [status, setStatus] = useGuessingStatus();
  const [colorIndex, setColorIndex] = useState({
    row: -1,
    i: props.guesses.wordLength() + 1,
  });

  // Set status to running when the word changes (a.k.a. new word)
  const word = props.guesses.getWord();
  useEffect(() => {
    setStatus("running");
  }, [word, setStatus]);

  // Start coloring animation when going to the next row.
  const currentRow = props.guesses.getCurrentRow();
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
      if (colorIndex.i < props.guesses.wordLength()) {
        const clone = props.guesses.clone();
        clone.setColor(colorIndex.row, colorIndex.i);
        props.setGuesses(clone);
      } else if (colorIndex.i === props.guesses.wordLength()) {
        if (props.guesses.isCorrect()) {
          if (status === "running") {
            guessCorrect.play().catch(toast.error);
            setStatus("finished");
          }
        } else if (props.guesses.outOfTries()) {
          if (status === "running") {
            guessOutOfTries.play().catch(toast.error);
            setStatus("paused");
          }
        } else if (status === "running") {
          const clone = props.guesses.clone();
          clone.prefillDiscovered();
          props.setGuesses(clone);
        }
      }
      setColorIndex({ ...colorIndex, i: colorIndex.i + 1 });
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
          <Button
            onClick={() => {
              setStatus("paused");
              guessTimeout.play().catch(toast.error);
              toast.error("Tijd voorbij!");
            }}
          >
            Tijd voorbij / fout woord
          </Button>
        )}

        {status === "paused" && (
          <>
            <Button
              onClick={() => {
                const clone = props.guesses.clone();
                if (clone.outOfTries()) {
                  clone.addRow();
                }
                clone.prefillDiscovered();
                props.setGuesses(clone);
                setStatus("running");
              }}
            >
              Extra kans
            </Button>
            <Button
              onClick={() => {
                props.toggleTeamGuessing();
                const clone = props.guesses.clone();
                if (clone.outOfTries()) {
                  clone.addRow();
                }
                if (clone.remainingUndiscovered() >= 2) {
                  clone.addBonusLetter();
                }
                clone.prefillDiscovered();
                props.setGuesses(clone);
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
        input={props.guesses.getInput()}
        setInput={(guess) => {
          if (status === "running") {
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
        firstTeamGuessing={props.firstTeamGuessing}
      />
    </>
  );
}
