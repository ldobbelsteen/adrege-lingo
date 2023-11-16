import toast from "react-hot-toast";
import { create1DArray, create2DArray } from "./misc";
import {
  letterCorrectLocation,
  letterIncorrect,
  letterIncorrectLocation,
} from "./sound-effects";

export enum Color {
  CorrectLocation,
  IncorrectLocation,
  Incorrect,
  None,
}

export class Guesses {
  private word: string[]; // array of chars
  readonly maxGuesses: number;
  readonly wordLength: number;

  private currentRow: number;
  private currentInput: string[];

  private chars: string[][];
  private colors: Color[][];
  private discovered: (string | undefined)[];

  constructor(word: string, maxGuesses: number) {
    this.word = Guesses.wordToChars(word);
    this.maxGuesses = maxGuesses;
    this.wordLength = this.word.length;

    this.currentRow = 0;
    this.currentInput = [];

    this.colors = create2DArray(this.maxGuesses, this.word.length, Color.None);
    this.chars = create2DArray(this.maxGuesses, this.word.length, ".");
    this.chars[0][0] = this.word[0];
    this.discovered = create1DArray(this.word.length, undefined);
    this.discovered[0] = this.word[0];
  }

  getRow() {
    return this.currentRow;
  }

  getInput() {
    return this.currentInput.join("");
  }

  setInput(word: string) {
    this.currentInput = Guesses.wordToChars(word).slice(0, this.word.length);
  }

  submitInput() {
    if (this.currentInput.length === this.word.length) {
      this.chars[this.currentRow] = this.currentInput;
      this.currentRow += 1;
      this.currentInput = [];
    }
  }

  getChar(row: number, i: number) {
    if (this.currentRow === row && !(this.currentInput.length <= i)) {
      return this.currentInput[i];
    } else {
      return this.chars[row][i];
    }
  }

  getColor(row: number, i: number) {
    return this.colors[row][i];
  }

  setColor(row: number, i: number) {
    if (this.colors[row][i] !== Color.None) {
      return;
    }

    if (this.chars[row][i] === this.word[i]) {
      this.colors[row][i] = Color.CorrectLocation;
      letterCorrectLocation.play().catch(toast.error);
      return;
    }

    // Count number of occurrences of letters in word.
    const wordOccs: { [letter: string]: number } = {};
    for (const letter of this.word) {
      if (wordOccs[letter]) {
        wordOccs[letter] += 1;
      } else {
        wordOccs[letter] = 1;
      }
    }

    // Count number of occurrences of correct letters in row.
    const correctOccs: { [letter: string]: number } = {};
    for (let j = 0; j < this.word.length; j++) {
      const letter = this.chars[row][j];
      if (letter === this.word[j]) {
        if (correctOccs[letter]) {
          correctOccs[letter] += 1;
        } else {
          correctOccs[letter] = 1;
        }
      }
    }

    if (
      this.word.includes(this.chars[row][i]) &&
      correctOccs[this.chars[row][i]] < wordOccs[this.chars[row][i]]
    ) {
      this.colors[row][i] = Color.IncorrectLocation;
      letterIncorrectLocation.play().catch(toast.error);
      return;
    }

    this.colors[row][i] = Color.Incorrect;
    letterIncorrect.play().catch(toast.error);
  }

  isComplete(row: number) {
    for (let i = 0; i < this.word.length; i++) {
      if (this.word[i] !== this.chars[row][i]) {
        return false;
      }
    }
    return true;
  }

  prefillDiscovered(row: number) {
    for (const discovered of this.getDiscovered()) {
      this.chars[row][discovered.index] = discovered.letter;
    }
  }

  private getDiscovered() {
    const result: { letter: string; index: number }[] = [];
    for (let j = 0; j < this.maxGuesses; j++) {
      for (let i = 0; i < this.word.length; i++) {
        if (this.colors[j][i] === Color.CorrectLocation) {
          result.push({
            letter: this.chars[j][i],
            index: i,
          });
        }
      }
    }
    return new Set(result);
  }

  private static wordToChars(word: string) {
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

  static fromJson(this: void, json: string) {
    return Object.assign(new Guesses("$", 1), JSON.parse(json)) as Guesses;
  }

  clone() {
    return Guesses.fromJson(JSON.stringify(this));
  }
}
