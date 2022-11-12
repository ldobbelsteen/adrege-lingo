import { useState } from "react";
import toast from "react-hot-toast";

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
        if (input.length < props.wordLength) {
          const diff = props.wordLength - input.length;
          toast.error(`Woord is ${diff} letter(s) te kort`);
        } else if (input.length === props.wordLength) {
          props.submit(input);
          setInput("");
        } else {
          const diff = input.length - props.wordLength;
          toast.error(`Woord is ${diff} letter(s) te lang`);
        }
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
