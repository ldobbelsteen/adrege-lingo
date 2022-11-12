import type { NextPage } from "next";
import { useState } from "react";
import GuessInput from "../components/GuessInput";
import LingoGrid from "../components/LingoGrid";

const Index: NextPage = () => {
  const word = "KERST";
  const [guesses, setGuesses] = useState<string[]>([]);

  return (
    <>
      <h1>Lingo</h1>
      <LingoGrid word={word} guesses={guesses} />
      <GuessInput
        wordLength={word.length}
        submit={(newGuess) => setGuesses((g) => [...g, newGuess])}
      />
    </>
  );
};

export default Index;
