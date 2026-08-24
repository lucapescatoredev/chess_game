import { createContext, useContext } from "react";
import { useChessGame } from "../hooks/useChessGame";

export type ChessGameContextValue = ReturnType<typeof useChessGame>;

export const ChessGameContext = createContext<ChessGameContextValue | null>(
  null,
);

export const useChessGameContext = () => {
  const game = useContext(ChessGameContext);

  if (!game) {
    throw new Error(
      "useChessGameContext must be used inside ChessGameProvider",
    );
  }

  return game;
};
