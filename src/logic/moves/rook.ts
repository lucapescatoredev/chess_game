import { getSlidingMoves } from ".";

export const rookOffset = [
  [0, -1],
  [-1, 0],
  [0, 1],
  [1, 0],
];
export const getRookMoves = (
  board: string[][],
  color: string,
  x: number,
  y: number,
) => {
  return getSlidingMoves(board, rookOffset, x, y, color);
};
