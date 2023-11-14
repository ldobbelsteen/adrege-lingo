import React from "react";

export function Title(props: { text: string }) {
  return <h1 className="m-2 font-bold text-6xl">{props.text}</h1>;
}
