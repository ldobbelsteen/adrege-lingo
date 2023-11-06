export const LingoCardDimensions = 5;

export type Letter = {
  char: string;
  given: boolean;
  color: Color;
};

export enum Color {
  CorrectLocation,
  IncorrectLocation,
  None,
}

export type Ball = {
  value: number;
  grabbed: boolean;
};

export function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export function cardHasLingo(balls: Ball[][]) {
  for (let i = 0; i < balls.length; i++) {
    let count = 0;
    for (let j = 0; j < balls[i].length; j++) {
      if (balls[i][j].grabbed) count++;
    }
    if (count === balls[i].length) {
      return true;
    }
  }
  for (let j = 0; j < balls[0].length; j++) {
    let count = 0;
    for (let i = 0; i < balls.length; i++) {
      if (balls[i][j].grabbed) count++;
    }
    if (count === balls.length) {
      return true;
    }
  }
  return false;
}

export function randomCard(type: "even" | "uneven"): Ball[][] {
  const maximumValue = 70;
  const prefilledCount = 8;
  const valueSet = Array.from({ length: maximumValue }, (_, i) => i + 1).filter(
    (v) => (v % 2 === 0 ? true : false) === (type === "even"),
  );
  const result: Ball[][] = [];
  for (let i = 0; i < LingoCardDimensions; i++) {
    const row: Ball[] = [];
    for (let j = 0; j < LingoCardDimensions; j++) {
      const random = randomInt(valueSet.length);
      row.push({
        value: valueSet[random],
        grabbed: false,
      });
      valueSet.splice(random, 1);
    }
    result.push(row);
  }
  for (let i = 0; i < prefilledCount; i++) {
    let x = randomInt(LingoCardDimensions);
    let y = randomInt(LingoCardDimensions);
    while (result[x][y].grabbed) {
      x = randomInt(LingoCardDimensions);
      y = randomInt(LingoCardDimensions);
    }
    result[x][y] = {
      value: result[x][y].value,
      grabbed: true,
    };
  }
  if (cardHasLingo(result)) {
    return randomCard(type);
  }
  return result;
}

export function createEmptyGuessGrid(word: string, allowedGuesses: number) {
  const grid: Letter[][] = [];
  for (let i = 0; i < allowedGuesses; i++) {
    const row: Letter[] = [];
    for (let j = 0; j < word.length; j++) {
      row.push({ char: ".", given: false, color: Color.None });
    }
    grid.push(row);
  }
  grid[0][0] = {
    char: word.charAt(0),
    color: Color.None,
    given: true,
  };
  return grid;
}
