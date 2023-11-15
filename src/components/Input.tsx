import React from "react";

export function Input(props: {
  input: string;
  setInput: (input: string) => void;
  onFocus?: () => void;
  placeholder: string;
}) {
  return (
    <input
      type="text"
      value={props.input}
      onFocus={props.onFocus}
      placeholder={props.placeholder}
      onChange={(ev) => props.setInput(ev.target.value)}
      className="text-donkerderrood rounded m-1 p-2"
    />
  );
}
