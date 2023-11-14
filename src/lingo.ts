import { create1DArray, create2DArray, randomPosInt } from "./misc";

export const CardDimensions = 5;
export const CardMaxValue = 70;
export const CardPrefilled = 8;
export const MaxGuesses = 5;

export enum Color {
  CorrectLocation,
  IncorrectLocation,
  None,
}

export class Guesses {
  word: string[]; // array of chars
  maxGuesses: number;

  currentGuess: number;
  currentGuessInput: string[];

  colors: Color[][];
  guesses: string[][];
  discovered: (string | undefined)[];

  constructor(word: string) {
    this.word = Guesses.wordToChars(word);
    this.maxGuesses = MaxGuesses;

    this.currentGuess = 0;
    this.currentGuessInput = [];

    this.colors = create2DArray(this.maxGuesses, this.word.length, Color.None);
    this.guesses = create2DArray(this.maxGuesses, this.word.length, ".");
    this.guesses[0][0] = this.word[0];
    this.discovered = create1DArray(this.word.length, undefined);
    this.discovered[0] = this.word[0];
  }

  static fromJson(this: void, json: string) {
    return Object.assign(new Guesses("$"), JSON.parse(json)) as Guesses;
  }

  clone() {
    return Guesses.fromJson(JSON.stringify(this));
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

  setCurrentGuessInput(word: string) {
    this.currentGuessInput = Guesses.wordToChars(word).slice(
      0,
      this.word.length,
    );
  }

  submitCurrentGuessInput() {
    if (this.currentGuessInput.length === this.word.length) {
      this.guesses[this.currentGuess] = this.currentGuessInput;
      this.addColors(this.currentGuess);
      this.currentGuess += 1;
      this.currentGuessInput = [];

      if (this.currentGuess < this.maxGuesses) {
        this.prefillDiscovered(this.currentGuess);
      }
    }
  }

  private addColors(row: number) {
    const correctOccs: { [letter: string]: number } = {};
    for (let i = 0; i < this.word.length; i++) {
      const letter = this.guesses[row][i];
      if (letter === this.word[i]) {
        this.colors[row][i] = Color.CorrectLocation;
        if (correctOccs[letter]) {
          correctOccs[letter] += 1;
        } else {
          correctOccs[letter] = 1;
        }
      }
    }

    const wordOccs: { [letter: string]: number } = {};
    for (const letter of this.word) {
      if (wordOccs[letter]) {
        wordOccs[letter] += 1;
      } else {
        wordOccs[letter] = 1;
      }
    }

    for (let i = 0; i < this.word.length; i++) {
      const letter = this.guesses[row][i];
      if (
        this.word.includes(letter) &&
        correctOccs[letter] < wordOccs[letter] &&
        this.colors[row][i] === Color.None
      ) {
        this.colors[row][i] = Color.IncorrectLocation;
      }
    }
  }

  private getDiscovered() {
    const result: { letter: string; index: number }[] = [];
    for (let j = 0; j < this.maxGuesses; j++) {
      for (let i = 0; i < this.word.length; i++) {
        if (this.colors[j][i] === Color.CorrectLocation) {
          result.push({
            letter: this.guesses[j][i],
            index: i,
          });
        }
      }
    }
    return new Set(result);
  }

  private prefillDiscovered(row: number) {
    for (const discovered of this.getDiscovered()) {
      this.guesses[row][discovered.index] = discovered.letter;
    }
  }
}

export class Card {
  values: number[][];
  grabbed: boolean[][];

  constructor(type: "even" | "uneven") {
    const valuePool = [];
    for (let i = type === "even" ? 2 : 1; i <= CardMaxValue; i += 2) {
      valuePool.push(i);
    }

    this.values = create2DArray(CardDimensions, CardDimensions, 0);
    for (let i = 0; i < CardDimensions; i++) {
      for (let j = 0; j < CardDimensions; j++) {
        const random = randomPosInt(valuePool.length);
        this.values[i][j] = valuePool[random];
        valuePool.splice(random, 1);
      }
    }

    this.grabbed = create2DArray(CardDimensions, CardDimensions, false);
    for (let p = CardPrefilled; p > 0; p--) {
      const i = randomPosInt(CardDimensions);
      const j = randomPosInt(CardDimensions);
      if (this.grabbed[i][j]) {
        p += 1;
      } else {
        this.grabbed[i][j] = true;
      }
    }
  }

  static fromJson(this: void, json: string) {
    return Object.assign(new Card("even"), JSON.parse(json)) as Card;
  }

  clone() {
    return Card.fromJson(JSON.stringify(this));
  }

  hasLingo() {
    for (let i = 0; i < CardDimensions; i++) {
      let count = 0;
      for (let j = 0; j < CardDimensions; j++) {
        if (this.grabbed[i][j]) count++;
      }
      if (count === CardDimensions) {
        return true;
      }
    }
    for (let j = 0; j < CardDimensions; j++) {
      let count = 0;
      for (let i = 0; i < CardDimensions; i++) {
        if (this.grabbed[i][j]) count++;
      }
      if (count === CardDimensions) {
        return true;
      }
    }
    return false;
  }
}
