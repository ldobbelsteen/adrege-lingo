import toast from "react-hot-toast";
import { fillArray } from "./misc";
import {
  letterCorrectLocation,
  letterIncorrect,
  letterIncorrectLocation,
} from "./sound";

export enum Color {
  CorrectLocation,
  IncorrectLocation,
  Incorrect,
  None,
}

export interface Guesses {
  chars: string[][];
  colors: Color[][];

  currentRow: number;
  currentInput: string[];

  targetChars: string[];
  discoveredChars: string[];
}

export function newGuesses(word: string, maxGuesses: number): Guesses {
  let result: Guesses = {
    chars: [],
    colors: [],
    currentRow: 0,
    currentInput: [],
    targetChars: wordToChars(word),
    discoveredChars: fillArray(word.length, "."),
  };

  // Give away first letter.
  result.discoveredChars[0] = result.targetChars[0];

  // Add the rows to the chars matrix.
  for (let i = 0; i < maxGuesses; i++) {
    result = addRow(result);
  }

  return prefillDiscovered(result);
}

export function withInput(guesses: Guesses, word: string): Guesses {
  return {
    ...guesses,
    currentInput: wordToChars(word).slice(0, guesses.targetChars.length),
  };
}

export function submitInput(guesses: Guesses): Guesses {
  if (guesses.currentInput.length !== guesses.targetChars.length) {
    toast.error("Woord niet lang genoeg!");
    return guesses;
  }

  return {
    ...guesses,
    discoveredChars: guesses.discoveredChars.map((char, i) => {
      if (char !== ".") return char;
      if (guesses.currentInput[i] === guesses.targetChars[i]) {
        return guesses.targetChars[i];
      } else {
        return ".";
      }
    }),
    chars: guesses.chars.map((row, rowIndex) => {
      if (rowIndex === guesses.currentRow) {
        return guesses.currentInput;
      } else {
        return row;
      }
    }),
    currentRow: guesses.currentRow + 1,
    currentInput: [],
  };
}

export function addRow(guesses: Guesses): Guesses {
  return {
    ...guesses,
    chars: [...guesses.chars, fillArray(guesses.targetChars.length, "")],
    colors: [
      ...guesses.colors,
      fillArray(guesses.targetChars.length, Color.None),
    ],
  };
}

export function addBonusLetter(guesses: Guesses): Guesses {
  const discoveredChars = [...guesses.discoveredChars];
  for (let i = 0; i < guesses.targetChars.length; i++) {
    if (discoveredChars[i] === ".") {
      discoveredChars[i] = guesses.targetChars[i];
      break;
    }
  }
  return prefillDiscovered({ ...guesses, discoveredChars });
}

export function remainingUndiscovered(guesses: Guesses): number {
  return guesses.discoveredChars.filter((l) => l === ".").length;
}

export function addColor(guesses: Guesses, i: number, j: number): Guesses {
  if (guesses.colors[i][j] !== Color.None) {
    return guesses;
  }

  if (guesses.chars[i][j] === guesses.targetChars[j]) {
    letterCorrectLocation.play().catch((e: unknown) => {
      console.error(e);
    });
    return {
      ...guesses,
      colors: guesses.colors.map((row, rowIndex) =>
        row.map((el, colIndex) => {
          if (i === rowIndex && j === colIndex) {
            return Color.CorrectLocation;
          } else {
            return el;
          }
        }),
      ),
    };
  }

  // Count number of occurrences of letters in word.
  const wordOccs: Record<string, number> = {};
  for (const letter of guesses.targetChars) {
    if (wordOccs[letter]) {
      wordOccs[letter] += 1;
    } else {
      wordOccs[letter] = 1;
    }
  }

  // Count number of occurrences of correct (or already yellowed) letters in row.
  const correctOccs: Record<string, number> = {};
  for (let k = 0; k < guesses.targetChars.length; k++) {
    const letter = guesses.chars[i][k];
    if (
      letter === guesses.targetChars[k] ||
      guesses.colors[i][k] === Color.IncorrectLocation
    ) {
      if (correctOccs[letter]) {
        correctOccs[letter] += 1;
      } else {
        correctOccs[letter] = 1;
      }
    }
  }

  if (
    guesses.targetChars.includes(guesses.chars[i][j]) &&
    (!correctOccs[guesses.chars[i][j]] ||
      correctOccs[guesses.chars[i][j]] < wordOccs[guesses.chars[i][j]])
  ) {
    letterIncorrectLocation.play().catch((e: unknown) => {
      console.error(e);
    });
    return {
      ...guesses,
      colors: guesses.colors.map((row, rowIndex) =>
        row.map((el, colIndex) => {
          if (i === rowIndex && j === colIndex) {
            return Color.IncorrectLocation;
          } else {
            return el;
          }
        }),
      ),
    };
  }

  letterIncorrect.play().catch((e: unknown) => {
    console.error(e);
  });
  return {
    ...guesses,
    colors: guesses.colors.map((row, rowIndex) =>
      row.map((el, colIndex) => {
        if (i === rowIndex && j === colIndex) {
          return Color.Incorrect;
        } else {
          return el;
        }
      }),
    ),
  };
}

export function prefillDiscovered(guesses: Guesses): Guesses {
  return {
    ...guesses,
    chars: guesses.chars.map((row, rowIndex) =>
      row.map((el, colIndex) => {
        if (rowIndex === guesses.currentRow) {
          return guesses.discoveredChars[colIndex];
        } else {
          return el;
        }
      }),
    ),
  };
}

export function isOutOfTries(guesses: Guesses): boolean {
  return guesses.currentRow === guesses.chars.length;
}

export function isCorrect(guesses: Guesses): boolean {
  for (const row of guesses.chars) {
    let rowIsFinished = true;
    for (let j = 0; j < guesses.targetChars.length; j++) {
      if (guesses.targetChars[j] !== row[j]) {
        rowIsFinished = false;
      }
    }
    if (rowIsFinished) {
      return true;
    }
  }
  return false;
}

function wordToChars(word: string) {
  const rawChars = word.toUpperCase().split("");
  const chars = [];

  for (let i = 0; i < rawChars.length; i++) {
    if (
      i < rawChars.length - 1 &&
      rawChars[i] === "I" &&
      rawChars[i + 1] == "J"
    ) {
      chars.push("IJ");
      i += 1;
    } else {
      chars.push(rawChars[i]);
    }
  }

  return chars;
}
