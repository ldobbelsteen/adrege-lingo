import type { ReactNode } from "react";

export function Box(props: { children: ReactNode }) {
  return (
    <div className={"m-2 p-4 bg-donkerishrood rounded-2xl shadow"}>
      {props.children}
    </div>
  );
}
