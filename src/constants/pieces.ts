export const rows: number[] = [8, 7, 6, 5, 4, 3, 2, 1];
export const columns: string[] = ["A", "B", "C", "D", "E", "F", "G", "H"];
const PIECE_BASE: string = "https://lichess1.org/assets/piece/cburnett";
export const PIECES = {
  wK: `${PIECE_BASE}/wK.svg`,
  wQ: `${PIECE_BASE}/wQ.svg`,
  wR: `${PIECE_BASE}/wR.svg`,
  wB: `${PIECE_BASE}/wB.svg`,
  wN: `${PIECE_BASE}/wN.svg`,
  wP: `${PIECE_BASE}/wP.svg`,
  bK: `${PIECE_BASE}/bK.svg`,
  bQ: `${PIECE_BASE}/bQ.svg`,
  bR: `${PIECE_BASE}/bR.svg`,
  bB: `${PIECE_BASE}/bB.svg`,
  bN: `${PIECE_BASE}/bN.svg`,
  bP: `${PIECE_BASE}/bP.svg`,
};

export const CheckType = {
  CHECK: "c",
  UNAVAVAILABLE: "u",
} as const;
export type CheckType = (typeof CheckType)[keyof typeof CheckType];

export const PieceColor = {
  WHITE: "w",
  BLACK: "b",
};
export type PieceColor = (typeof PieceColor)[keyof typeof PieceColor];

export const PieceType = {
  QUEEN: "Q",
  KING: "K",
  ROOK: "R",
  BISHOP: "B",
  KNIGHT: "N",
  PAWN: "P",
} as const;

export type PieceType = (typeof PieceType)[keyof typeof PieceType];

export type Move = {
  x: number;
  y: number;
  z?: number;
};
// interface MoveOptions {
//   board: string[][];
//   color: string;
//   x: number;
//   y: number;
//   unavailableSquares: number[][];
// }

export const DRAG_OVER = "drag-over";
export const OPACITY = "opacity";

export const getEnemyPieces = (enemyColor: PieceColor) => {
  return {
    enemyQueen: `${enemyColor}${PieceType.QUEEN}`,
    enemyRook: `${enemyColor}${PieceType.ROOK}`,
    enemyBishop: `${enemyColor}${PieceType.BISHOP}`,
    enemyKnight: `${enemyColor}${PieceType.KNIGHT}`,
    enemyKing: `${enemyColor}${PieceType.KING}`,
  };
};
export const getEnemyColor = (color: PieceColor): PieceColor => {
  return color === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;
};
export const getAlliesPieces = (allyColor: PieceColor) => {
  return {
    queen: `${allyColor}${PieceType.QUEEN}`,
    rook: `${allyColor}${PieceType.ROOK}`,
    bishop: `${allyColor}${PieceType.BISHOP}`,
    knight: `${allyColor}${PieceType.KNIGHT}`,
    king: `${allyColor}${PieceType.KING}`,
  };
};
