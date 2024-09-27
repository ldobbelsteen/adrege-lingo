import React from "react";

export function Title(props: {
  text: string;
  textSize: string;
  className?: string;
}) {
  return (
    <h1 className={`m-2 font-bold ${props.textSize} ${props.className ?? ""}`}>
      {props.text}
    </h1>
  );
}
