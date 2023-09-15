import React from "react";

export type Ball = {
  value: number;
  grabbed: boolean;
};

export function hasLingo(balls: Ball[][]) {
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

export function initLingo(
  even: boolean,
  max: number,
  prefilled: number,
): Ball[][] {
  const set = Array.from({ length: max }, (_, i) => i + 1).filter((v) => {
    if (even) {
      return v % 2 === 0;
    } else {
      return v % 2 === 1;
    }
  });
  const result: Ball[][] = [];
  for (let i = 0; i < 5; i++) {
    const row: Ball[] = [];
    for (let j = 0; j < 5; j++) {
      const random = Math.floor(Math.random() * set.length);
      row.push({
        value: set[random],
        grabbed: false,
      });
      set.splice(random, 1);
    }
    result.push(row);
  }
  for (let i = 0; i < prefilled; i++) {
    let x = Math.floor(Math.random() * 5);
    let y = Math.floor(Math.random() * 5);
    while (result[x][y].grabbed) {
      x = Math.floor(Math.random() * 5);
      y = Math.floor(Math.random() * 5);
    }
    result[x][y] = {
      value: result[x][y].value,
      grabbed: true,
    };
  }
  if (hasLingo(result)) {
    return initLingo(even, max, prefilled);
  }
  return result;
}

export default function Kaart(props: {
  title: string;
  balls: Ball[][];
  setBalls: (balls: Ball[][]) => void;
}) {
  return (
    <table>
      <caption>{props.title}</caption>
      <tbody>
        {[...Array<number>(5)].map((_, i) => (
          <tr key={i}>
            {[...Array<number>(5)].map((_, j) => (
              <td key={j}>
                <div className="h-24 w-24 rounded-full m-1 text-bordeaux text-6xl bg-white">
                  <button
                    onClick={() => {
                      const copy = [...props.balls];
                      copy[i] = [...props.balls[i]];
                      copy[i][j] = {
                        value: props.balls[i][j].value,
                        grabbed: true,
                      };
                      props.setBalls(copy);
                    }}
                    className="h-24 w-24 rounded-full absolute flex justify-center items-center"
                  >
                    {props.balls[i][j].value}
                  </button>
                  {props.balls[i][j].grabbed && (
                    <div className="h-24 w-24 rounded-full bg-pilsgeel"></div>
                  )}
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
