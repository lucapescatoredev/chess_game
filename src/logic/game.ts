import {
  getEnemyColor,
  PieceColor,
  PieceType,
  type Move,
} from "../constants/pieces";
import { getLegalMoves, playerHasLegalMoves } from "./moves";
import { castleKing, getChecks, type KingState } from "./moves/king";
import {
  enPassantStarting,
  getPawnDirection,
  type EnPassantState,
} from "./moves/pawn";
import type {
  GameState,
  GameStatus,
  Position,
  PromotionPiece,
  PromotionState,
} from "./types";

export const selectSquare = (
  state: GameState,
  position: Position
): GameState => {
  let sameColor = false;
  if (state.selected !== null) {
    const from = state.board[state.selected.x][state.selected.y];
    const to = state.board[position.x][position.y];
    if (to !== null) {
      if (from[0] === to[0]) sameColor = true;
    }
  }
  if (
    state.selected !== null &&
    (state.selected.x !== position.x || state.selected.y !== position.y) &&
    !sameColor
  ) {
    return playMove(state, position);
  }
  const piece = state.board[position.x][position.y];
  if (!piece || piece[0] !== state.turn || state.status.type === "checkmate") {
    return {
      ...state,
      selected: null,
      legalMoves: [],
    };
  }
  return {
    ...state,
    selected: position,
    legalMoves: getLegalMoves(
      state.board,
      piece,
      position.x,
      position.y,
      state.king,
      state.enPassant,
      state.status,
      state.status.type === "check"
        ? state.status.checks.filter((check) => check.z !== -1)
        : []
    ),
  };
};

export const playMove = (state: GameState, move: Move): GameState => {
  if (!state.selected) return state;
  const isLegal = state.legalMoves.some(
    ({ x, y }) => x === move.x && y === move.y
  );
  if (!isLegal) {
    return {
      ...state,
      selected: null,
      legalMoves: [],
    };
  }
  const board = state.board.map((row) => [...row]);
  const enemyColor = getEnemyColor(state.turn);
  const { x: xFrom, y: yFrom } = state.selected;
  const pieceMoved = board[xFrom][yFrom];
  const pieceCaptured = board[move.x][move.y];
  const captured = pieceCaptured !== null;
  board[xFrom][yFrom] = null;
  board[move.x][move.y] = pieceMoved;
  const color = state.turn;
  const [castled, king] = updateKingState(
    board,
    state.king,
    move,
    color,
    enemyColor,
    pieceMoved,
    pieceCaptured
  );
  const [enPassanted, enPassant] = updateEnPassantState(
    board,
    state.enPassant,
    { x: xFrom, y: yFrom },
    move,
    color
  );
  const [promoted, promotion] = updatePromotionState(board, move, color);
  const prevGameState: GameState = {
    ...state,
    board,
    king,
    turn: enemyColor,
    selected: null,
    legalMoves: [],
    enPassant,
    promotion,
    status: { type: "playing" },
  };
  const evaluatedPosition: GameStatus = evaluatePosition(prevGameState);
  return {
    ...prevGameState,
    status: evaluatedPosition,
    sound: getMoveSound(
      evaluatedPosition,
      captured,
      castled,
      enPassanted,
      promoted
    ),
  };
};

export const promotePawn = (
  state: GameState,
  piece: PromotionPiece
): GameState => {
  const promotion = state.promotion;
  if (!promotion.isPromoting || !promotion.color) return state;
  const board = state.board.map((row) => [...row]);
  board[promotion.x][promotion.y] = `${promotion.color}${piece}`;
  const nextState: GameState = {
    ...state,
    board,
    promotion: {
      isPromoting: false,
      x: -1,
      y: -1,
      color: null,
    },
  };
  // if (promotion.isPromoting) {
  //   return nextState;
  // }
  return {
    ...nextState,
    status: evaluatePosition(nextState),
  };
};

const evaluatePosition = (state: GameState): GameStatus => {
  const color = state.turn;
  const enemyColor = getEnemyColor(color);
  const king = state.king[color];
  const checks = getChecks(state.board, enemyColor, king.x, king.y);
  const isInCheck = checks.length > 0;
  const hasLegalMove = playerHasLegalMoves(state, color, checks);
  if (isInCheck && !hasLegalMove) {
    return {
      type: "checkmate",
      winner: enemyColor,
      loser: color,
    };
  }
  if (!isInCheck && !hasLegalMove) {
    return {
      type: "stalemate",
    };
  }
  if (isInCheck) {
    return {
      type: "check",
      color: color,
      checks: checks,
    };
  }
  // if (state.status.type === "capture") return { type: "capture" };
  // if (state.status.type === "castling") return { type: "castling" };

  return { type: "playing" };
};
const updateKingState = (
  board: Array<Array<string | null>>,
  king: KingState,
  to: Move,
  color: PieceColor,
  enemyColor: PieceColor,
  pieceMoved: string,
  pieceCaptured: string | null
): [boolean, KingState] => {
  let castled = false;
  //if rook is captured or moved, I disable the corresponding castling side
  if (
    pieceMoved === `${color}${PieceType.ROOK}` ||
    pieceCaptured === `${enemyColor}${PieceType.ROOK}`
  ) {
    switch (to.y) {
      case 0:
        return [
          castled,
          {
            ...king,
            [color]: {
              ...king[color],
              canCastleQueenSide: false,
            },
          },
        ];
      case 7:
        return [
          castled,
          {
            ...king,
            [color]: {
              ...king[color],
              canCastleKingSide: false,
            },
          },
        ];
    }
  }

  //if i'm not moving the king, i return the current state
  if (board[to.x][to.y] !== `${color}${PieceType.KING}`) return [castled, king];

  //performing the castling
  if ((to.y === 2 || to.y === 6) && king[color].canCastle) {
    castled = true;
    return [castled, castleKing(board, color, to.y, king)];
  }
  //I'm moving the king by one square, hence we can no longer castle
  return [
    castled,
    {
      ...king,
      [color]: {
        ...king[color],
        canCastle: false,
        canCastleKingSide: false,
        canCastleQueenSide: false,
        x: to.x,
        y: to.y,
      },
    },
  ];
};
const updateEnPassantState = (
  board: Array<Array<string | null>>,
  enPassant: EnPassantState,
  from: Move,
  to: Move,
  color: PieceColor
): [boolean, EnPassantState] => {
  let enPassanted = false;
  let enPassantState = { ...enPassantStarting };
  if (board[to.x][to.y] !== `${color}${PieceType.PAWN}`)
    return [enPassanted, enPassantState];

  //check for en passant
  if (Math.abs(to.x - from.x) === 2) {
    enPassantState = { canEnPassant: true, x: to.x, y: to.y };
  }
  const direction = getPawnDirection(color);
  if (to.x === enPassant.x + 1 * direction && to.y === enPassant.y) {
    enPassanted = true;
    board[enPassant.x][enPassant.y] = null;
  }
  return [enPassanted, enPassantState];
};
const updatePromotionState = (
  board: string[][],
  to: Move,
  color: PieceColor
): [boolean, PromotionState] => {
  let promoted = false;
  //if a pawn reaches the last row successfully, it can promote
  if (board[to.x][to.y] !== `${color}${PieceType.PAWN}`)
    return [promoted, { isPromoting: false, x: -1, y: -1, color: null }];
  const lastRow = color === PieceColor.WHITE ? 0 : 7;
  if (to.x !== lastRow)
    return [promoted, { isPromoting: false, x: -1, y: -1, color: null }];
  promoted = true;
  return [
    promoted,
    {
      isPromoting: true,
      x: to.x,
      y: to.y,
      color: color,
    },
  ];
};
export const setTimeoutState = (state: GameState): GameState => {
  return { ...state, status: { type: "timeout" } };
};
const getMoveSound = (
  evaluatedPosition: GameStatus,
  captured: boolean,
  castled: boolean,
  enPassanted: boolean,
  promoted: boolean
): string => {
  if (evaluatedPosition.type === "check") return "check";
  // if (evaluatedPosition.type === "checkmate") return "checkmate";
  // if (evaluatedPosition.type === "stalemate") return "stalemate";
  if (captured) return "capture";
  if (castled) return "castling";
  if (promoted) return "";
  if (enPassanted || captured) return "capture";
  return "playing";
};
