import { useState } from "react";
import type { ReactNode } from "react";

export function Button(props: {
  children: ReactNode;
  onClick: () => void;
  pressed?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <button
      type="button"
      onClick={props.onClick}
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseDown={() => {
        setPressed(true);
      }}
      onMouseUp={() => {
        setPressed(false);
      }}
      onMouseLeave={() => {
        setPressed(false);
        setHover(false);
      }}
      className={`shadow rounded m-1 p-2 ${
        pressed || props.pressed
          ? "bg-donkerderderderrood"
          : hover
            ? "bg-donkerderderrood"
            : "bg-donkerderrood shadow-inner"
      }`}
    >
      {props.children}
    </button>
  );
}
