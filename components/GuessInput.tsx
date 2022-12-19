import { useState } from "react";

export default function GuessInput(props: {
  wordLength: number;
  submit: (text: string) => void;
}) {
  const [input, setInput] = useState("");

  return (
    <form
      className="p-2"
      onSubmit={(e) => {
        e.preventDefault();
        props.submit(input);
      }}
    >
      <input
        type="text"
        value={input}
        className="w-48 text-center"
        placeholder="Vul woord in"
        onChange={(e) => setInput(e.target.value.toUpperCase())}
      />
    </form>
  );
}
