import { isAlly } from ".";
import type { Move } from "../../constants/pieces";
import { isOnBoard } from "../board";
export const knightOffsets = [
  [-1, -2],
  [-2, -1],
  [-2, 1],
  [-1, 2],
  [1, 2],
  [2, 1],
  [2, -1],
  [1, -2],
];
export const getKnightMoves = (
  board: string[][],
  color: string,
  x: number,
  y: number,
): Move[] => {
  const moves: Move[] = [];
  for (const [i, j] of knightOffsets) {
    const xCoord = x + i;
    const yCoord = y + j;
    if (isOnBoard(xCoord, yCoord) && !isAlly(board, color, xCoord, yCoord))
      moves.push({ x: xCoord, y: yCoord });
  }
  return moves;
};
