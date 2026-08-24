import { getSlidingMoves } from ".";
import type { Move } from "../../constants/pieces";
export const bishopOffset = [
  [-1, -1],
  [-1, 1],
  [1, 1],
  [1, -1],
];

export const getBishopMoves = (
  board: string[][],
  color: string,
  x: number,
  y: number,
): Move[] => {
  return getSlidingMoves(board, bishopOffset, x, y, color);
};
