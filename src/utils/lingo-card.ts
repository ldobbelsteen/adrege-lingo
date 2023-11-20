import toast from "react-hot-toast";
import { create2DArray, randomPosInt } from "./misc";
import { guessCorrect, lingoBall } from "./sound-effects";

export class Card {
  private values: number[][];
  private isGrabbed: boolean[][];
  private isFavorite: boolean[][];
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

    this.isGrabbed = create2DArray(dimensions, dimensions, false);
    for (let p = prefilled; p > 0; p--) {
      const i = randomPosInt(dimensions);
      const j = randomPosInt(dimensions);
      if (this.isGrabbed[i][j]) {
        p += 1;
      } else {
        this.isGrabbed[i][j] = true;
      }
    }

    this.isFavorite = create2DArray(dimensions, dimensions, false);
    this.dimensions = dimensions;
  }

  toggleGrabbed(i: number, j: number) {
    if (this.isGrabbed[i][j]) {
      this.isGrabbed[i][j] = false;
    } else {
      this.isGrabbed[i][j] = true;
      if (this.hasLingo()) {
        guessCorrect.play().catch(toast.error);
      } else {
        lingoBall.play().catch(toast.error);
      }
    }
    this.updateFavorites();
  }

  getValue(i: number, j: number) {
    return this.values[i][j];
  }

  getIsGrabbed(i: number, j: number) {
    return this.isGrabbed[i][j];
  }

  getIsFavorite(i: number, j: number) {
    return this.isFavorite[i][j];
  }

  private updateFavorites() {
    for (let i = 0; i < this.dimensions; i++) {
      for (let j = 0; j < this.dimensions; j++) {
        this.isFavorite[i][j] =
          !this.isGrabbed[i][j] &&
          (this.countGrabbedRow(i) === this.dimensions - 1 ||
            this.countGrabbedCol(j) === this.dimensions - 1);
      }
    }
  }

  private countGrabbedRow(i: number) {
    let count = 0;
    for (let j = 0; j < this.dimensions; j++) {
      if (this.isGrabbed[i][j]) {
        count += 1;
      }
    }
    return count;
  }

  private countGrabbedCol(j: number) {
    let count = 0;
    for (let i = 0; i < this.dimensions; i++) {
      if (this.isGrabbed[i][j]) {
        count += 1;
      }
    }
    return count;
  }

  hasLingo() {
    for (let i = 0; i < this.dimensions; i++) {
      if (this.countGrabbedRow(i) === this.dimensions) {
        return true;
      }
    }
    for (let j = 0; j < this.dimensions; j++) {
      if (this.countGrabbedCol(j) === this.dimensions) {
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
