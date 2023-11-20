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

  currentRow: number;
  private currentInput: string[];

  private matrix: string[][]; // rows of guessed words
  private colors: Color[][];
  private discovered: string[]; // dot (.) indicates undiscovered

  constructor(word: string, maxGuesses: number) {
    this.word = Guesses.wordToChars(word);
    this.maxGuesses = maxGuesses;
    this.wordLength = this.word.length;

    this.currentRow = 0;
    this.currentInput = [];

    this.colors = create2DArray(this.maxGuesses, this.word.length, Color.None);
    this.matrix = create2DArray(this.maxGuesses, this.word.length, "");
    this.discovered = create1DArray(this.word.length, ".");
    this.discovered[0] = this.word[0];
    this.fillDiscovered();
  }

  getInput() {
    return this.currentInput.join("");
  }

  setInput(word: string) {
    this.currentInput = Guesses.wordToChars(word).slice(0, this.word.length);
  }

  submitInput() {
    if (this.currentInput.length === this.word.length) {
      for (let i = 0; i < this.word.length; i++) {
        if (this.currentInput[i] === this.word[i]) {
          this.discovered[i] = this.word[i];
        }
      }

      this.matrix[this.currentRow] = this.currentInput;
      this.currentRow += 1;
      this.currentInput = [];
    }
  }

  getLetter(row: number, i: number) {
    if (this.currentRow === row && !(this.currentInput.length <= i)) {
      return this.currentInput[i];
    } else {
      return this.matrix[row][i];
    }
  }

  getColor(row: number, i: number) {
    return this.colors[row][i];
  }

  setColor(row: number, i: number) {
    if (this.colors[row][i] !== Color.None) {
      return;
    }

    if (this.matrix[row][i] === this.word[i]) {
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

    // Count number of occurrences of correct (or already yellowed) letters in row.
    const correctOccs: { [letter: string]: number } = {};
    for (let i = 0; i < this.word.length; i++) {
      const letter = this.matrix[row][i];
      if (
        letter === this.word[i] ||
        this.getColor(row, i) === Color.IncorrectLocation
      ) {
        if (correctOccs[letter]) {
          correctOccs[letter] += 1;
        } else {
          correctOccs[letter] = 1;
        }
      }
    }

    if (
      this.word.includes(this.matrix[row][i]) &&
      (!correctOccs[this.matrix[row][i]] ||
        correctOccs[this.matrix[row][i]] < wordOccs[this.matrix[row][i]])
    ) {
      this.colors[row][i] = Color.IncorrectLocation;
      letterIncorrectLocation.play().catch(toast.error);
      return;
    }

    this.colors[row][i] = Color.Incorrect;
    letterIncorrect.play().catch(toast.error);
  }

  isFinished(row: number) {
    for (let i = 0; i < this.word.length; i++) {
      if (this.word[i] !== this.matrix[row][i]) {
        return false;
      }
    }
    return true;
  }

  fillDiscovered() {
    for (let i = 0; i < this.word.length; i++) {
      this.matrix[this.currentRow][i] = this.discovered[i];
    }
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
