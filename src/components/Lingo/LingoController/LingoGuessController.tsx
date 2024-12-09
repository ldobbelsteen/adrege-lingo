import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import guessingMusicUrl from "../../../assets/guessing_music.ogg";
import {
  type Guesses,
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
import { randomPosInt } from "../../../utils/misc";
import {
  guessCorrect,
  guessOutOfTries,
  guessTimeout,
} from "../../../utils/sound";
import {
  useFirstTeamGuessing,
  useGuesses,
  useGuessingStatus,
  useMaxGuesses,
  useNormalWords,
  useShowWord,
  useOwnWords,
  useTeamMode,
} from "../../../utils/storage";
import { Box } from "../../Box";
import { Button } from "../../Button";
import { Elapsed } from "../../Elapsed";
import { Multiselect } from "../../Multiselect";
import { Music } from "../../Music";
import { TextInputWithSubmitButton } from "../../TextInput";
import { Title } from "../../Title";
import { LingoGuessView } from "../LingoView/LingoGuessView";

export function LingoGuessController() {
  const [newWord, setNewWord] = useState("");
  const [maxGuesses] = useMaxGuesses();
  const [teamMode] = useTeamMode();

  const [guesses, setGuesses] = useGuesses();
  const [firstTeamGuessing, setFirstTeamGuessing] = useFirstTeamGuessing();

  const [normalWords, setNormalWords] = useNormalWords();
  const [ownWords, setOwnWords] = useOwnWords();

  const startWord = useCallback(
    (word: string) => {
      setGuesses(newGuesses(word, maxGuesses));
      toast.success("Woord gestart!");
    },
    [maxGuesses, setGuesses],
  );

  if (guesses) {
    return (
      <LingoGuessInstance
        guesses={guesses}
        setGuesses={setGuesses}
        firstTeamGuessing={teamMode ? firstTeamGuessing : null}
        toggleTeamGuessing={() => {
          setFirstTeamGuessing(!firstTeamGuessing);
        }}
      />
    );
  }

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
      <div className="flex">
        <Box>
          <Title text="Eigen woord" textSize="text-2xl" />
          <TextInputWithSubmitButton
            input={newWord}
            setInput={setNewWord}
            placeholder="Typ woord..."
            submitButtonText="Start"
            onSubmit={() => {
              if (newWord.length < 3) {
                toast.error("Woord is te kort!");
                return;
              }
              if (newWord.length > 8) {
                toast.error("Woord is te lang!");
                return;
              }
              startWord(newWord);
              setNewWord("");
            }}
          />
        </Box>
        <Box>
          <Title text="Random normale woorden" textSize="text-2xl" />
          {Object.entries(normalWords).map(
            ([category, words]) =>
              words.length > 0 && (
                <Button
                  key={category}
                  onClick={() => {
                    const w = words[randomPosInt(words.length)];
                    setNormalWords({
                      ...normalWords,
                      [category]: words.filter((v) => v !== w),
                    });
                    startWord(w);
                  }}
                >
                  {category}
                </Button>
              ),
          )}
        </Box>
      </div>
      <Box>
        <Title text="Eigen woorden" textSize="text-2xl" />
        <div className="flex gap-4">
          {Object.entries(ownWords).map(
            ([category, words]) =>
              words.length > 0 && (
                <WordSelectColumn
                  key={category}
                  title={category}
                  words={words}
                  selectWord={(w) => {
                    setOwnWords({
                      ...ownWords,
                      [category]: words.filter((v) => v !== w),
                    });
                    startWord(w);
                  }}
                />
              ),
          )}
        </div>
      </Box>
    </>
  );
}

function WordSelectColumn(props: {
  title: string;
  words: string[];
  selectWord: (w: string) => void;
}) {
  return (
    <div className="flex flex-col">
      <Title text={props.title} textSize="text-xl" />
      {props.words.map((w) => (
        <Button
          key={w}
          onClick={() => {
            props.selectWord(w);
          }}
        >
          {w}
        </Button>
      ))}
    </div>
  );
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
  const [showWord, setShowWord] = useShowWord();

  useEffect(() => {
    setShowWord(false);
  }, [setShowWord]);

  useEffect(() => {
    if (status === "running") {
      setStartTime(new Date());
    }
  }, [status]);

  // Set status to running when the word changes
  useEffect(() => {
    setStatus("running");
  }, [setStatus]);

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
            guessCorrect.play().catch((e: unknown) => {
              console.error(e);
            });
            setStatus("finished");
          }
        } else if (isOutOfTries(props.guesses)) {
          if (status === "running") {
            guessOutOfTries.play().catch((e: unknown) => {
              console.error(e);
            });
            setStatus("paused");
          }
        } else if (status === "running") {
          setStartTime(new Date());
          props.setGuesses(prefillDiscovered(props.guesses));
        }
      }
      setColorIndex({ ...colorIndex, j: colorIndex.j + 1 });
    }, 200);
    return () => {
      clearTimeout(timeout);
    };
  }, [colorIndex, props, setStatus, status]);

  return (
    <>
      <Music playing={status === "running"} src={guessingMusicUrl} />

      <div>
        <Button
          onClick={() => {
            props.setGuesses(null);
            setShowWord(false);
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
                guessTimeout.play().catch((e: unknown) => {
                  console.error(e);
                });
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
              Beurtwissel (met bonusletter)
            </Button>
            {!showWord && (
              <Button
                onClick={() => {
                  setShowWord(true);
                }}
              >
                Toon juiste woord
              </Button>
            )}
          </>
        )}
      </div>

      <TextInputWithSubmitButton
        input={props.guesses.currentInput.join("")}
        setInput={(guess) => {
          if (status === "running") {
            props.setGuesses(withInput(props.guesses, guess));
          }
        }}
        placeholder="Typ poging..."
        submitButtonText="Poging insturen"
        onSubmit={() => {
          props.setGuesses(submitInput(props.guesses));
        }}
      />

      <LingoGuessView
        guesses={props.guesses}
        firstTeamGuessing={props.firstTeamGuessing}
        showTargetWord={showWord}
      />
    </>
  );
}
