import { useState } from "react";

export function randomPosInt(max: number) {
  return Math.floor(Math.random() * max);
}

export function create1DArray<T>(length: number, defaultValue: T) {
  const result = [];
  for (let i = 0; i < length; i++) {
    result.push(defaultValue);
  }
  return result;
}

export function create2DArray<T>(
  rows: number,
  cols: number,
  defaultValue: T,
): T[][] {
  const result = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push(defaultValue);
    }
    result.push(row);
  }
  return result;
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
