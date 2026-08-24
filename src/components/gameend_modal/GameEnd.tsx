import { getEnemyColor, PieceColor } from "../../constants/pieces";

import "./gameend.css";
type GameEndProps = {
  color: PieceColor;
  status: "checkmate" | "stalemate" | "timeout";
  onNewGame: () => void;
};

export const GameEnd = (props: GameEndProps) => {
  const message = createGameEndMessage(props.color, props.status);
  return (
    <div className="overlay">
      <div className="modal">
        <div className="gameend-main">
          <span className="gameend-message">{message}</span>
          <button className="gameend-newgame" onClick={props.onNewGame}>
            Start new game
          </button>
        </div>
      </div>
    </div>
  );
};
const createGameEndMessage = (color: string, status: string): string => {
  if (status === "stalemate") return "Stalemate";
  const winner = getEnemyColor(color) === PieceColor.WHITE ? "White" : "Black";
  return `${winner} wins by ${status}`;
};
