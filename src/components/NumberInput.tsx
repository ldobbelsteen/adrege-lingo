import React from "react";

export function NumberInput(props: {
  input: number;
  setInput: (input: number) => void;
  placeholder?: string;
  min?: number;
  max?: number;
}) {
  return (
    <input
      type="number"
      value={props.input}
      min={props.min}
      max={props.max}
      placeholder={props.placeholder}
      onChange={(ev) => {
        props.setInput(Number.parseInt(ev.target.value));
      }}
      className="text-donkerderrood rounded p-2 m-2 w-16"
    />
  );
}
