import React from "react";

export function Checkbox(props: {
  checked: boolean;
  setChecked: (checked: boolean) => void;
}) {
  return (
    <input
      type="checkbox"
      checked={props.checked}
      onChange={() => props.setChecked(!props.checked)}
    />
  );
}
