import type { Move } from "../../constants/pieces";
import { getBishopMoves } from "./bishop";
import { getRookMoves } from "./rook";

export const getQueenMoves = (
  board: string[][],
  color: string,
  x: number,
  y: number,
): Move[] => {
  return [
    ...getBishopMoves(board, color, x, y),
    ...getRookMoves(board, color, x, y),
  ];
};
