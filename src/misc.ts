import { useState } from "react";

export function copyNested<T>(arr: T[][]) {
  const copy = [];
  for (let i = 0; i < arr.length; i++) {
    copy.push([...arr[i]]);
  }
  return copy;
}

export function usePrevious<T>(value: T): T | undefined {
  const [current, setCurrent] = useState(value);
  const [previous, setPrevious] = useState<T>();

  if (value !== current) {
    setPrevious(current);
    setCurrent(value);
  }

  return previous;
}
