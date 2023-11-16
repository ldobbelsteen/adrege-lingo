import toast from "react-hot-toast";
import { create2DArray, randomPosInt } from "./misc";
import { guessCorrect, lingoBall } from "./sound-effects";

export class Card {
  private values: number[][];
  private grabbed: boolean[][];
  readonly dimensions: number;

  constructor(
    type: "even" | "uneven",
    maxValue: number,
    dimensions: number,
    prefilled: number,
  ) {
    const valuePool = [];
    for (let i = type === "even" ? 2 : 1; i <= maxValue; i += 2) {
      valuePool.push(i);
    }

    this.values = create2DArray(dimensions, dimensions, 0);
    for (let i = 0; i < dimensions; i++) {
      for (let j = 0; j < dimensions; j++) {
        const random = randomPosInt(valuePool.length);
        this.values[i][j] = valuePool[random];
        valuePool.splice(random, 1);
      }
    }

    this.grabbed = create2DArray(dimensions, dimensions, false);
    for (let p = prefilled; p > 0; p--) {
      const i = randomPosInt(dimensions);
      const j = randomPosInt(dimensions);
      if (this.grabbed[i][j]) {
        p += 1;
      } else {
        this.grabbed[i][j] = true;
      }
    }

    this.dimensions = dimensions;
  }

  toggleGrabbed(i: number, j: number) {
    if (this.grabbed[i][j]) {
      this.grabbed[i][j] = false;
    } else {
      this.grabbed[i][j] = true;
      if (this.hasLingo()) {
        guessCorrect.play().catch(toast.error);
      } else {
        lingoBall.play().catch(toast.error);
      }
    }
  }

  getValue(i: number, j: number) {
    return this.values[i][j];
  }

  isGrabbed(i: number, j: number) {
    return this.grabbed[i][j];
  }

  hasLingo() {
    for (let i = 0; i < this.dimensions; i++) {
      let count = 0;
      for (let j = 0; j < this.dimensions; j++) {
        if (this.grabbed[i][j]) count++;
      }
      if (count === this.dimensions) {
        return true;
      }
    }
    for (let j = 0; j < this.dimensions; j++) {
      let count = 0;
      for (let i = 0; i < this.dimensions; i++) {
        if (this.grabbed[i][j]) count++;
      }
      if (count === this.dimensions) {
        return true;
      }
    }
    return false;
  }

  static fromJson(this: void, json: string) {
    return Object.assign(new Card("even", 0, 0, 0), JSON.parse(json)) as Card;
  }

  clone() {
    return Card.fromJson(JSON.stringify(this));
  }
}
