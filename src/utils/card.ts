import { fillNestedArray, randomPosInt } from "./misc";
import { guessCorrect, lingoBall } from "./sound";

export interface Card {
  values: number[][];
  isGrabbed: boolean[][];
  isFavorite: boolean[][];
  dimensions: number;
}

export function newCard(
  type: "even" | "uneven",
  maxValue: number,
  dimensions: number,
  prefilled: number,
): Card {
  const result = {
    values: fillNestedArray(dimensions, dimensions, 0),
    isGrabbed: fillNestedArray(dimensions, dimensions, false),
    isFavorite: fillNestedArray(dimensions, dimensions, false),
    dimensions: dimensions,
  };

  // Fill card with random even or uneven values.
  const valuePool = [];
  for (let i = type === "even" ? 2 : 1; i <= maxValue; i += 2) {
    valuePool.push(i);
  }
  for (let i = 0; i < dimensions; i++) {
    for (let j = 0; j < dimensions; j++) {
      const random = randomPosInt(valuePool.length);
      result.values[i][j] = valuePool[random];
      valuePool.splice(random, 1);
    }
  }

  // Set prefilled balls.
  for (let p = prefilled; p > 0; p--) {
    const i = randomPosInt(dimensions);
    const j = randomPosInt(dimensions);
    if (result.isGrabbed[i][j]) {
      p += 1;
    } else {
      result.isGrabbed[i][j] = true;
    }
  }

  return updateFavorites(result);
}

export function toggleGrabbed(card: Card, i: number, j: number): Card {
  const isGrabbed = card.isGrabbed.map((row, rowIndex) =>
    row.map((el, colIndex) => {
      if (i === rowIndex && j == colIndex) {
        return !el;
      } else {
        return el;
      }
    }),
  );
  const result = { ...card, isGrabbed };
  if (!card.isGrabbed[i][j]) {
    if (hasLingo(result)) {
      guessCorrect.play().catch((e: unknown) => {
        console.error(e);
      });
    } else {
      lingoBall.play().catch((e: unknown) => {
        console.error(e);
      });
    }
  }
  return updateFavorites(result);
}

function countGrabbedRow(card: Card, i: number) {
  let count = 0;
  for (let j = 0; j < card.dimensions; j++) {
    if (card.isGrabbed[i][j]) {
      count += 1;
    }
  }
  return count;
}

function countGrabbedCol(card: Card, j: number) {
  let count = 0;
  for (let i = 0; i < card.dimensions; i++) {
    if (card.isGrabbed[i][j]) {
      count += 1;
    }
  }
  return count;
}

function countGrabbedDiagonal(card: Card, rising: boolean) {
  let count = 0;
  for (let i = 0; i < card.dimensions; i++) {
    if (card.isGrabbed[rising ? card.dimensions - 1 - i : i][i]) {
      count += 1;
    }
  }
  return count;
}

function hasLingo(card: Card): boolean {
  for (let i = 0; i < card.dimensions; i++) {
    if (countGrabbedRow(card, i) === card.dimensions) {
      return true;
    }
  }
  for (let j = 0; j < card.dimensions; j++) {
    if (countGrabbedCol(card, j) === card.dimensions) {
      return true;
    }
  }
  if (countGrabbedDiagonal(card, true) === card.dimensions) {
    return true;
  }
  if (countGrabbedDiagonal(card, false) === card.dimensions) {
    return true;
  }
  return false;
}

function isOnDiagonal(
  card: Card,
  rising: boolean,
  i: number,
  j: number,
): boolean {
  if (rising) {
    return j === card.dimensions - 1 - i;
  } else {
    return i === j;
  }
}

function updateFavorites(card: Card): Card {
  const isFavorite = fillNestedArray(card.dimensions, card.dimensions, false);
  for (let i = 0; i < card.dimensions; i++) {
    for (let j = 0; j < card.dimensions; j++) {
      isFavorite[i][j] =
        !card.isGrabbed[i][j] &&
        (countGrabbedRow(card, i) === card.dimensions - 1 ||
          countGrabbedCol(card, j) === card.dimensions - 1 ||
          (isOnDiagonal(card, true, i, j) &&
            countGrabbedDiagonal(card, true) === card.dimensions - 1) ||
          (isOnDiagonal(card, false, i, j) &&
            countGrabbedDiagonal(card, false) === card.dimensions - 1));
    }
  }
  return { ...card, isFavorite };
}
