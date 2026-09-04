import { PieceColor, type Move } from "../constants/pieces";
import type { KingState } from "./moves/king";
import type { EnPassantState } from "./moves/pawn";
export type GameAction =
  | { type: "select"; position: Position }
  | { type: "move"; position: Position }
  | { type: "promote"; piece: PromotionPiece }
  | { type: "timeout"; color: PieceColor }
  | { type: "reset" };
export type Position = {
  x: number;
  y: number;
};
export type GameState = {
  board: Array<Array<string | null>>;
  turn: PieceColor;
  king: KingState;
  castling: CastlingRights;
  promotion: PromotionState | null;
  enPassant: EnPassantState | null;
  selected: Position | null;
  legalMoves: Move[];
  status: GameStatus;
  sound: string;
};
export type CastlingRights = {
  color: PieceColor;
  canCastle: boolean;
  canCastleKingSide: boolean;
  canCastleQueenSide: boolean;
};
// export type PromotionState = {
//   position: Position;
//   pieceType: PromotionPiece;
// };

export type PromotionState = {
  isPromoting: boolean;
  xFrom: number;
  yFrom: number;
  x: number;
  y: number;
  color: string | null;
};

export type PromotionPiece = "Q" | "R" | "B" | "N";
export type GameStatus =
  | { type: "playing" }
  | { type: "check"; color: PieceColor; checks: Move[] }
  | { type: "checkmate"; winner: PieceColor; loser: PieceColor }
  | { type: "stalemate" }
  | { type: "timeout" };

export const SoundsType = {
  WHITE: "w",
  BLACK: "b",
};
export type GameSound =
  | "move"
  | "capture"
  | "castling"
  | "check"
  | "illegal"
  | "gameEnd"
  | "promotion";
