import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import backgroundMusicUrl from "../../../assets/sounds/background_music.ogg";
import { Guesses } from "../../../lingo";
import { timeOutSound } from "../../../sound";
import { Button } from "../../Button";
import { Input } from "../../Input";
import { Music } from "../../Music";
import { LingoGuessView } from "../LingoView/LingoGuessView";

export function LingoGuessController(props: {
  guesses: Guesses | null;
  setGuesses: (g: Guesses | null) => void;
  teamOne: boolean;
}) {
  const [newWord, setNewWord] = useState("");
  const [playMusic, setPlayMusic] = useState(false);
  const { guesses } = props;

  useEffect(() => setPlayMusic(true), [guesses]);

  return guesses ? (
    <>
      <Music playing={playMusic} src={backgroundMusicUrl} />

      <div>
        <Button onClick={() => props.setGuesses(null)}>Verwijder woord</Button>
        <Button
          onClick={() => {
            timeOutSound.play().catch(toast.error);
          }}
        >
          Tijd voorbij
        </Button>
      </div>

      <div>
        <Input
          placeholder="Typ poging..."
          input={guesses.currentGuessInput.join("")}
          setInput={(guess) => {
            const clone = guesses.clone();
            clone.setCurrentGuessInput(guess);
            props.setGuesses(clone);
          }}
        />
        <Button
          onClick={() => {
            const clone = guesses.clone();
            clone.submitCurrentGuessInput();
            props.setGuesses(clone);
          }}
        >
          Poging insturen
        </Button>
      </div>

      <LingoGuessView guesses={guesses} teamOne={props.teamOne} />
    </>
  ) : (
    <>
      <div>
        <Input
          placeholder="Typ nieuw woord..."
          input={newWord}
          setInput={setNewWord}
        />
        <Button
          onClick={() => {
            if (newWord.length >= 3) {
              props.setGuesses(new Guesses(newWord));
              setNewWord("");
              toast.success("Woord gestart!");
            }
          }}
        >
          Start woord
        </Button>
      </div>
    </>
  );
}
