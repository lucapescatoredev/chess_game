import { PieceColor, type Move } from "../../constants/pieces";

export const getPawnMoves = (
  board: string[][],
  color: string,
  x: number,
  y: number,
  enPassant: EnPassantState
): Move[] => {
  const moves: Move[] = [];
  const direction: number = getPawnDirection(color);
  const startingRow = getPawnStartingRow(color);
  const rowForward: number = x + 1 * direction;
  const twoRowForward: number = x + 2 * direction;
  const oneSquareForward = board[rowForward][y];
  const captureLeftSquare = board[rowForward][y - 1];
  const captureRightSquare = board[rowForward][y + 1];
  // oneSquareForward === null && moves.push([rowForward, y]);
  oneSquareForward === null && moves.push({ x: rowForward, y: y });

  if (x === startingRow) {
    const twoSquareForward = board[twoRowForward][y];
    twoSquareForward === null &&
      board[rowForward][y] === null &&
      moves.push({ x: twoRowForward, y: y });
  }
  if (captureLeftSquare && captureLeftSquare[0] !== color)
    moves.push({ x: rowForward, y: y - 1 });
  if (captureRightSquare && captureRightSquare[0] !== color)
    moves.push({ x: rowForward, y: y + 1 });

  if (
    enPassant.canEnPassant &&
    x === enPassant.x &&
    (y === enPassant.y - 1 || y === enPassant.y + 1)
  ) {
    moves.push({ x: rowForward, y: enPassant.y });
  }
  return moves;
};
export const getPawnDirection = (color: string) => {
  return color === PieceColor.WHITE ? -1 : 1;
};
export const getPawnStartingRow = (color: string) => {
  return color === PieceColor.WHITE ? 6 : 1;
};
export type EnPassantState = typeof enPassantStarting;

export const enPassantStarting = {
  canEnPassant: false,
  x: -1,
  y: -1,
};
