import type { ReactNode } from "react";
import { useChessGame } from "../hooks/useChessGame";
import { ChessGameContext } from "./ChessGameContext";

export const ChessGameProvider = ({ children }: { children: ReactNode }) => {
  const game = useChessGame();

  return (
    <ChessGameContext.Provider value={game}>
      {children}
    </ChessGameContext.Provider>
  );
};
