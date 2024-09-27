import React from "react";
import { Button } from "./Button";

export function Multiselect<T>(props: {
  selected: T;
  setSelected: (selected: T) => void;
  options: Record<string, T>;
}) {
  return Object.entries(props.options).map(([k, v]) => (
    <Button
      key={k}
      onClick={() => {
        props.setSelected(v);
      }}
      pressed={props.selected === v}
    >
      {k}
    </Button>
  ));
}
