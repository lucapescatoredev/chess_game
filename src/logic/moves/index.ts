import {
  getEnemyColor,
  PieceColor,
  PieceType,
  type Move,
} from "../../constants/pieces";
import { isOnBoard } from "../board";
import type { GameState, GameStatus } from "../types";
import { getBishopMoves } from "./bishop";
import { getChecks, getKingMoves, type KingState } from "./king";
import { getKnightMoves } from "./knight";
import { enPassantStarting, getPawnMoves, type EnPassantState } from "./pawn";
import { getQueenMoves } from "./queen";
import { getRookMoves } from "./rook";

export const startMovesQueue = [];
export const getLegalMoves = (
  board: string[][],
  piece: string,
  x: number,
  y: number,
  king: KingState,
  enPassant: EnPassantState,
  status: GameStatus,
  checks: Move[]
): Move[] => {
  if (piece === null) return [];
  const [color, type] = piece;
  switch (type) {
    case PieceType.KING:
      return getKingMoves({
        board: board,
        color: color,
        x: x,
        y: y,
        directCheckedSquares: checks,
        king,
        status,
      });
    case PieceType.QUEEN:
      return FilterPinnedMoves(
        board,
        x,
        y,
        getQueenMoves(board, color, x, y),
        king,
        color
      );
    case PieceType.ROOK:
      return FilterPinnedMoves(
        board,
        x,
        y,
        getRookMoves(board, color, x, y),
        king,
        color
      );
    case PieceType.BISHOP:
      return FilterPinnedMoves(
        board,
        x,
        y,
        getBishopMoves(board, color, x, y),
        king,
        color
      );
    case PieceType.KNIGHT:
      return FilterPinnedMoves(
        board,
        x,
        y,
        getKnightMoves(board, color, x, y),
        king,
        color
      );
    case PieceType.PAWN:
      return FilterPinnedMoves(
        board,
        x,
        y,
        getPawnMoves(board, color, x, y, enPassant),
        king,
        color
      );
  }
  return [];
};
export const isAlly = (
  board: string[][],
  color: string,
  x: number,
  y: number
): boolean => {
  if (board[x][y] === null) return false;
  return board[x][y][0] === color;
};
export const getSlidingMoves = function (
  board: string[][],
  coordinates: number[][],
  x: number,
  y: number,
  color: string
): Move[] {
  const moves: Move[] = [];
  for (const [i, j] of coordinates) {
    let xCoord = x + i;
    let yCoord = y + j;
    while (isOnBoard(xCoord, yCoord)) {
      const foundPiece = board[xCoord][yCoord];
      if (foundPiece) {
        if (!isAlly(board, color, xCoord, yCoord))
          moves.push({ x: xCoord, y: yCoord });
        break;
      }
      moves.push({ x: xCoord, y: yCoord });
      xCoord += i;
      yCoord += j;
    }
  }
  return moves;
};
export const FilterPinnedMoves = (
  board: string[][],
  start_x: number,
  start_y: number,
  moves: Move[],
  king: KingState,
  color: PieceColor
): Move[] => {
  const validMoves: Move[] = [];
  const enemyColor = getEnemyColor(color);
  for (const move of moves) {
    const tempBoard = structuredClone(board);
    const piece = tempBoard[start_x][start_y];
    tempBoard[start_x][start_y] = null;
    tempBoard[move.x][move.y] = piece;
    const checks = getChecks(
      tempBoard,
      enemyColor,
      king[color].x,
      king[color].y
    );
    if (checks.length) continue;
    validMoves.push({ x: move.x, y: move.y });
  }
  return validMoves;
};

export const getEveryPossibleCapture = (
  board: string[][],
  color: PieceColor,
  target: Move,
  king: KingState,
  enPassant: EnPassantState,
  status: GameStatus
): Move[] => {
  const moves: Move[] = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (!piece || piece[0] !== color || piece[1] === PieceType.KING) continue;
      const pieceLegalMoves = getLegalMoves(
        board,
        piece,
        i,
        j,
        king,
        enPassant,
        status,
        []
      );
      for (const move of pieceLegalMoves) {
        if (move.x === target.x && move.y === target.y)
          moves.push({ x: move.x, y: move.y });
      }
    }
  }
  return moves;
};

export const getEveryPossibleMoves = (
  board: string[][],
  color: PieceColor,
  king: KingState,
  enPassant: EnPassantState,
  status: GameStatus
): Move[] => {
  const moves: Move[] = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (!piece || piece[0] !== color || piece[1] === PieceType.KING) continue;
      const pieceLegalMoves = getLegalMoves(
        board,
        piece,
        i,
        j,
        king,
        enPassant,
        status,
        status.type === "check" ? status.checks : []
      );
      moves.push(...pieceLegalMoves);
    }
  }
  return moves;
};

export const playerHasLegalMoves = (
  state: GameState,
  color: PieceColor,
  checks: Move[]
): boolean => {
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      const piece = state.board[x][y];

      if (!piece || piece[0] !== color) {
        continue;
      }
      const moves = getLegalMoves(
        state.board,
        piece,
        x,
        y,
        state.king,
        state.enPassant ?? enPassantStarting,
        state.status,
        checks
      );

      if (moves.length > 0) {
        return true;
      }
    }
  }

  return false;
};
