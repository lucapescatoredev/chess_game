import { PieceColor } from "../constants/pieces";

export const initialBoard = [
  ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
  ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
  ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"],
];

// export const initialBoard = [
//   ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
//   ["bP", "bP", "wP", "bP", "bP", "bP", "bP", "bP"],
//   [null, null, "wN", null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
//   ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"],
// ];
// export const initialBoard = [
//   ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
//   ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, "wB", null, null, null, "wQ", null, null],
//   ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
//   ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"],
// ];

// export const initialBoard = [
//   ["bR", null, null, null, "bK", null, null, "bR"],
//   ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
//   ["wR", null, null, null, "wK", null, null, "wR"],
// ];

// export const initialBoard = [
//   ["bR", null, null, null, "bK", null, null, "bR"],
//   [null, "bB", "bB", "bB", "bB", "bB", "wB", null],
//   [null, null, null, null, null, null, "bB", null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, "bB", null, null],
//   [null, null, null, null, null, null, null, "bQ"],
//   ["wR", null, null, null, "wK", null, null, "wR"],
// ];

// export const initialBoard = [
//   ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
//   [null, null, null, null, null, null, null, null],
//   [null, null, "wP", null, null, null, "wP", null],
//   ["wP", "wP", null, "wP", "wP", "wP", null, "wP"],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"],
// ];

// export const initialBoard = [
//   ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   ["bP", "bP", null, "bP", "bP", "bP", null, "bP"],
//   [null, null, "bP", null, null, null, "bP", null],
//   [null, null, null, null, null, null, null, null],
//   ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"],
// ];
// export const initialBoard = [
//   ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   ["bP", "bP", null, "bP", "bP", "bP", null, "bP"],
//   [null, null, "bP", null, null, null, "bP", null],
//   [null, null, null, null, null, null, null, null],
//   ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"],
// ];

// export const initialBoard = [
//   ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
//   [null, null, "bP", null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"],
// ];

// export const initialBoard = [
//   ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
//   [null, null, "wP", null, null, null, null, null],
//   [null, null, "wN", null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, "wK", null, null, null],
// ];
// export const initialBoard = [
//   [null, null, null, null, null, "bK", null, null],
//   [null, null, null, null, null, "wP", null, null],
//   [null, null, null, null, "wK", null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
// ];

export const isOnBoard = (x: number, y: number): boolean => {
  if (x > 7 || x < 0 || y > 7 || y < 0) return false;
  return true;
};
export const getStartingRow = (color: PieceColor) => {
  return color === PieceColor.WHITE ? 7 : 0;
};
