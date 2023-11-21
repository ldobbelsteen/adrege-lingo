import React, { useState } from "react";

export function Button(props: {
  children: React.ReactNode;
  onClick: () => void;
  pressed?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <button
      type="button"
      onClick={props.onClick}
      onMouseEnter={() => setHover(true)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => {
        setPressed(false);
        setHover(false);
      }}
      className={`rounded m-1 p-2 ${
        pressed || props.pressed
          ? "bg-donkerderderderrood"
          : hover
            ? "bg-donkerderderrood"
            : "bg-donkerderrood"
      }`}
    >
      {props.children}
    </button>
  );
}
