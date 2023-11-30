import React from "react";

export function Box(props: { children: React.ReactNode }) {
  return (
    <div className={`m-2 p-4 bg-donkerishrood rounded-2xl`}>
      {props.children}
    </div>
  );
}
