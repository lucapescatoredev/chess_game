import { isAlly } from ".";
import {
  CheckType,
  getEnemyColor,
  getEnemyPieces,
  PieceColor,
  PieceType,
  type Move,
} from "../../constants/pieces";
import { getStartingRow, isOnBoard } from "../board";
import type { GameStatus } from "../types";
import { bishopOffset } from "./bishop";
import { knightOffsets } from "./knight";
import { rookOffset } from "./rook";

export const kingMoves: Move[] = [
  { x: -1, y: -1 },
  { x: -1, y: 0 },
  { x: -1, y: 1 },
  { x: 1, y: -1 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 0, y: -1 },
  { x: 0, y: 1 },
];

export const kingStartingPosition: KingState = {
  w: {
    canCastle: true,
    canCastleKingSide: true,
    canCastleQueenSide: true,
    x: 7,
    y: 4,
    check: {
      checked: false,
      doubleChecked: false,
      x: -1,
      y: -1,
    },
  },
  b: {
    canCastle: true,
    canCastleKingSide: true,
    canCastleQueenSide: true,
    x: 0,
    y: 4,
    check: {
      checked: false,
      doubleChecked: false,
      x: -1,
      y: -1,
    },
  },
};

export type KingState = {
  w: King;
  b: King;
};

export type King = {
  canCastle: boolean;
  canCastleKingSide: boolean;
  canCastleQueenSide: boolean;
  x: number;
  y: number;
  check: kingCheck;
};

export type kingCheck = {
  checked: boolean;
  doubleChecked: boolean;
  x: number;
  y: number;
};

export const getKingMoves = ({
  board,
  color,
  x,
  y,
  directCheckedSquares,
  king,
  status,
}: {
  board: string[][];
  color: string;
  x: number;
  y: number;
  directCheckedSquares: Move[];
  king: KingState;
  status: GameStatus;
}): Move[] => {
  const moves: Move[] = [];
  const enemyColor = getEnemyColor(color);
  const rook = `${color}${PieceType.ROOK}`;

  // regular moves
  for (const move of kingMoves) {
    const xCoord = x + move.x;
    const yCoord = y + move.y;
    if (isOnBoard(xCoord, yCoord) && !isAlly(board, color, xCoord, yCoord))
      moves.push({ x: xCoord, y: yCoord });
  }
  // const kingInitialRow = color === WHITE ? 7 : 0;
  const kingInitialRow = getStartingRow(color);
  //castling moves
  if (status.type === "playing") {
    if (king[color].canCastle) {
      if (
        king[color].canCastleKingSide &&
        board[kingInitialRow][5] === null &&
        board[kingInitialRow][6] === null &&
        board[kingInitialRow][7] === rook
      ) {
        moves.push({ x: x, y: y + 2 });
      }
      if (
        king[color].canCastleQueenSide &&
        board[kingInitialRow][3] === null &&
        board[kingInitialRow][2] === null &&
        board[kingInitialRow][1] === null &&
        board[kingInitialRow][0] === rook
      ) {
        moves.push({ x: x, y: y - 2 });
      }
    }
  }
  const undirectChecksList: Move[] = [];
  moves.forEach(({ x, y }) => {
    const undirectChecks = getUnavailableSquares(board, enemyColor, x, y);
    undirectChecks.length && undirectChecksList.push(...undirectChecks);
  });

  let unavailableSquares =
    directCheckedSquares.length && undirectChecksList.length
      ? [...directCheckedSquares, ...undirectChecksList]
      : undirectChecksList;

  //filtering attacked castling moves
  if (king[color].canCastle) {
    //king side filtering
    if (
      unavailableSquares.some(
        (move) => move.x === kingInitialRow && move.y === 5,
      )
    ) {
      unavailableSquares.push({ x: kingInitialRow, y: 6 });
    }
    //queen side filtering
    if (
      unavailableSquares.some(
        (move) => move.x === kingInitialRow && move.y === 3,
      )
    ) {
      unavailableSquares.push({ x: kingInitialRow, y: 2 });
    }
  }

  unavailableSquares = unavailableSquares.filter((square) => square.z !== -1);
  // filtering the moves againts the checked ones
  const validMoves: Move[] = moves.filter(
    (move) => !unavailableSquares.some((u) => move.x === u.x && move.y === u.y),
  );
  return validMoves;
};

export const castleKing = (
  board: string[][],
  color: string,
  y: number,
  kingState: KingState,
): KingState => {
  const row: number = color === PieceColor.WHITE ? 7 : 0;
  const kingPiece: string = `${color}${PieceType.KING}`;
  const rook: string = `${color}${PieceType.ROOK}`;
  const isKingSide = y > 2;
  const kingColumn = isKingSide ? 6 : 2;
  board[row][4] = null;
  board[row][isKingSide ? 7 : 0] = null;
  board[row][kingColumn] = kingPiece;
  board[row][isKingSide ? 5 : 3] = rook;

  const kingColor = color as keyof KingState;
  return {
    ...kingState,
    [kingColor]: {
      ...kingState[kingColor],
      castled: true,
      canCastle: false,
      canCastleKingSide: false,
      canCastleQueenSide: false,
      x: row,
      y: kingColumn,
      check: {
        checked: false,
        x: row,
        y: kingColumn,
      },
    },
  };
};
export const getChecks = (
  board: string[][],
  enemyColor: PieceColor,
  x: number,
  y: number,
): Move[] => {
  const checks: Move[] = [];
  const { enemyQueen, enemyRook, enemyBishop, enemyKnight } =
    getEnemyPieces(enemyColor);

  //searching for any possible pawn checks
  const pawnsChecks = getPawnsChecks(board, enemyColor, x, y);
  pawnsChecks.length && checks.push(...pawnsChecks);
  //searching for any possible knight checks
  const knightChecks = getKnightChecks(board, enemyKnight, x, y);
  knightChecks.length && checks.push(...knightChecks);
  // searching for any possible bishop, rook or queen checks
  const diagonalSlidingChecks = getSlidingChecks(
    board,
    bishopOffset,
    [enemyBishop, enemyQueen],
    x,
    y,
    enemyColor,
  );
  diagonalSlidingChecks.length && checks.push(...diagonalSlidingChecks);
  const straightSlidingChecks = getSlidingChecks(
    board,
    rookOffset,
    [enemyRook, enemyQueen],
    x,
    y,
    enemyColor,
  );
  straightSlidingChecks.length && checks.push(...straightSlidingChecks);
  return checks;
};
const getPawnsChecks = (
  board: string[][],
  enemyColor: PieceColor,
  x: number,
  y: number,
): Move[] => {
  const checks = [];
  const enemyPawn = `${enemyColor}${PieceType.PAWN}`;
  const pawnRow = enemyColor === PieceColor.WHITE ? x + 1 : x - 1;
  const [pawnLeftCol, pawnRightCol] = [y - 1, y + 1];
  if (
    isOnBoard(pawnRow, pawnLeftCol) &&
    board[pawnRow][pawnLeftCol] === enemyPawn
  )
    checks.push({ x: pawnRow, y: pawnLeftCol, z: -1 });
  if (
    isOnBoard(pawnRow, pawnRightCol) &&
    board[pawnRow][pawnRightCol] === enemyPawn
  )
    checks.push({ x: pawnRow, y: pawnRightCol, z: -1 });

  return checks;
};
const getKnightChecks = (
  board: string[][],
  enemyKnight: string,
  x: number,
  y: number,
) => {
  const checks = [];
  for (const [i, j] of knightOffsets) {
    const xCoord = x + i;
    const yCoord = y + j;
    if (isOnBoard(xCoord, yCoord) && board[xCoord][yCoord] === enemyKnight) {
      checks.push({ x: xCoord, y: yCoord, z: -1 });
      break;
    }
  }
  //if a start looking for knights and i found one of them, the initial square i started looking from it's unavailable
  checks.length && checks.push({ x, y });
  return checks;
};
//TO DO: USE MORE MEANINGFUL VARIABLES NAMES
const getSlidingChecks = (
  board: string[][],
  offset: number[][],
  targetPieces: string[],
  x: number,
  y: number,
  enemyColor: PieceColor,
  checkType: CheckType = CheckType.CHECK,
): Move[] => {
  let currentSquareIsEnemy = false;
  if (checkType === CheckType.UNAVAVAILABLE) {
    if (!isOnBoard(x, y)) return [];
    if (board[x][y]) {
      if (board[x][y][0] !== enemyColor) return [];
      else currentSquareIsEnemy = true;
    }
  }

  let checks = [];
  const foundIndexes = [];
  const [rookOrBishop, queen] = targetPieces;
  const map = new Map<number, Move[]>();
  let pair = { a: null, b: null };
  for (const [index, [i, j]] of offset.entries()) {
    let xCoord = x + i;
    let yCoord = y + j;
    map.set(index, []);
    while (isOnBoard(xCoord, yCoord)) {
      const tempCheck: Move[] = map.get(index);
      const foundPiece = board[xCoord][yCoord];
      if (foundPiece) {
        if (foundPiece === rookOrBishop || foundPiece === queen) {
          tempCheck.push({ x: xCoord, y: yCoord, z: -1 });
          map.set(index, tempCheck);
          foundIndexes.push(index);
          switch (index) {
            case 0:
              pair.a = 0;
              pair.b = 2;
              break;
            case 1:
              pair.a = 1;
              pair.b = 3;
              break;
            case 2:
              pair.a = 2;
              pair.b = 0;
              break;
            case 3:
              pair.a = 3;
              pair.b = 1;
              break;
          }
          break;
        } else break;
      }
      tempCheck.push({ x: xCoord, y: yCoord });
      map.set(index, [...tempCheck]);
      xCoord += i;
      yCoord += j;
    }
  }
  if (pair.a !== null && pair.b !== null) {
    if (currentSquareIsEnemy) {
      for (const index of foundIndexes) {
        checks.push(...map.get(index));
      }
    } else {
      const a = map.get(pair.a);
      const b = map.get(pair.b);
      checks = a.concat(b);
    }
  }

  // When searching for unavailable squares, if any are found,
  // I also want to consider the square I started searching from as a possible valid square.
  // // Example: if a bishop is checking the king, the king may be able to capture it,
  // // provided the bishop is not protected by another piece.

  if (checkType === CheckType.UNAVAVAILABLE) {
    checks.length && checks.push({ x, y });
  }

  return checks;
};
const getUnavailableSquaresPawns = (
  board: string[][],
  enemyColor: PieceColor,
  x: number,
  y: number,
): Move[] => {
  const unavailableSquares = [];
  const enemyPawn = `${enemyColor}${PieceType.PAWN}`;
  const pawnRow = enemyColor === PieceColor.WHITE ? x + 1 : x - 1;
  const rowBehind = enemyColor === PieceColor.WHITE ? x - 1 : x + 1;
  const pawnPrevRow = enemyColor === PieceColor.WHITE ? x + 2 : x - 2;

  const [pawnLeftCol, pawnRightCol] = [y - 1, y + 1];
  const [pawnLeftLeftCol, pawnRightRigthCol] = [y - 2, y + 2];

  if (isOnBoard(x, pawnLeftCol) && board[x][pawnLeftCol] === enemyPawn) {
    unavailableSquares.push({ x: rowBehind, y: y });
  }
  if (isOnBoard(x, pawnRightCol) && board[x][pawnRightCol] === enemyPawn) {
    unavailableSquares.push({ x: rowBehind, y: y });
  }
  if (isOnBoard(pawnRow, y) && board[pawnRow][y] === enemyPawn) {
    unavailableSquares.push({ x: x, y: pawnLeftCol });
    unavailableSquares.push({ x: x, y: pawnRightCol });
  }
  if (
    isOnBoard(pawnPrevRow, pawnLeftCol) &&
    board[pawnPrevRow][pawnLeftCol] === enemyPawn
  )
    unavailableSquares.push({ x: pawnRow, y: y });
  if (
    isOnBoard(pawnPrevRow, pawnRightCol) &&
    board[pawnPrevRow][pawnRightCol] === enemyPawn
  )
    unavailableSquares.push({ x: pawnRow, y: y });

  if (isOnBoard(pawnPrevRow, y) && board[pawnPrevRow][y] === enemyPawn) {
    unavailableSquares.push({ x: pawnRow, y: pawnLeftCol });
    unavailableSquares.push({ x: pawnRow, y: pawnRightCol });
  }
  if (
    isOnBoard(pawnPrevRow, pawnLeftLeftCol) &&
    board[pawnPrevRow][pawnLeftLeftCol] === enemyPawn
  )
    unavailableSquares.push({ x: pawnRow, y: pawnLeftCol });
  if (
    isOnBoard(pawnPrevRow, pawnRightRigthCol) &&
    board[pawnPrevRow][pawnRightRigthCol] === enemyPawn
  )
    unavailableSquares.push({ x: pawnRow, y: pawnRightCol });
  if (
    isOnBoard(pawnRow, pawnLeftLeftCol) &&
    board[pawnRow][pawnLeftLeftCol] === enemyPawn
  )
    unavailableSquares.push({ x: x, y: pawnLeftCol });
  if (
    isOnBoard(pawnRow, pawnRightRigthCol) &&
    board[pawnRow][pawnRightRigthCol] === enemyPawn
  )
    unavailableSquares.push({ x: x, y: pawnRightCol });

  if (isOnBoard(x, pawnLeftLeftCol) && board[x][pawnLeftLeftCol] === enemyPawn)
    unavailableSquares.push({ x: rowBehind, y: pawnLeftCol });
  if (
    isOnBoard(x, pawnRightRigthCol) &&
    board[x][pawnRightRigthCol] === enemyPawn
  )
    unavailableSquares.push({ x: rowBehind, y: pawnRightCol });
  return unavailableSquares;
};
const getUnavailablesSquaresKing = (
  board: string[][],
  enemyKing: string,
  x: number,
  y: number,
): Move[] => {
  const unavailableSquares: Move[] = [];
  kingMoves.forEach((move) => {
    const [xCoord, yCoord] = [x + move.x, y + move.y];
    if (isOnBoard(xCoord, yCoord) && board[xCoord][yCoord] === enemyKing)
      unavailableSquares.push({ x, y });
  });

  return unavailableSquares;
};
const getUnavailableSquares = (
  board: string[][],
  enemyColor: PieceColor,
  x: number,
  y: number,
): Move[] => {
  const { enemyQueen, enemyRook, enemyBishop, enemyKnight, enemyKing } =
    getEnemyPieces(enemyColor);
  const unavailableSquares: Move[] = [];
  const unavailableSquares_pawns = getUnavailableSquaresPawns(
    board,
    enemyColor,
    x,
    y,
  );
  unavailableSquares_pawns.length &&
    unavailableSquares.push(...unavailableSquares_pawns);

  kingMoves.forEach((move) => {
    const [xCoord, yCoord] = [x + move.x, y + move.y];
    const unavailableSquares_knight = getKnightChecks(
      board,
      enemyKnight,
      xCoord,
      yCoord,
    );
    unavailableSquares_knight.length &&
      unavailableSquares.push(...unavailableSquares_knight);

    const unavailableSquares_bishopOrQueen = getSlidingChecks(
      board,
      bishopOffset,
      [enemyBishop, enemyQueen],
      xCoord,
      yCoord,
      enemyColor,
      CheckType.UNAVAVAILABLE,
    );

    unavailableSquares_bishopOrQueen.length &&
      unavailableSquares.push(...unavailableSquares_bishopOrQueen);

    const unavailableSquares_RookOrQueen = getSlidingChecks(
      board,
      rookOffset,
      [enemyRook, enemyQueen],
      xCoord,
      yCoord,
      enemyColor,
      CheckType.UNAVAVAILABLE,
    );
    unavailableSquares_RookOrQueen.length &&
      unavailableSquares.push(...unavailableSquares_RookOrQueen);

    const unavailableSquares_king = getUnavailablesSquaresKing(
      board,
      enemyKing,
      xCoord,
      yCoord,
    );
    unavailableSquares_king.length &&
      unavailableSquares.push(...unavailableSquares_king);
  });

  return unavailableSquares;
};

// interface MoveOptions {
//   board: string[][];
//   color: string;
//   x: number;
//   y: number;
//   unavailableSquares: number[][];
// }
