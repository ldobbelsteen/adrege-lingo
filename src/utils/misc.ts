export function randomPosInt(max: number) {
  return Math.floor(Math.random() * max);
}

export function sortedArray<T>(arr: T[]) {
  return [...arr].sort();
}

export function fillArray<T>(length: number, value: T) {
  const result = [];
  for (let i = 0; i < length; i++) {
    result.push(value);
  }
  return result;
}

export function fillNestedArray<T>(
  rows: number,
  cols: number,
  value: T,
): T[][] {
  const result = [];
  for (let i = 0; i < rows; i++) {
    result.push(fillArray(cols, value));
  }
  return result;
}
