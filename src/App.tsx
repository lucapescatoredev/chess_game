import { useState } from "react";
import { Chessboard } from "./components/chessboard/Chessboard";
import { ColorSelector } from "./components/color_selector/ColorSelector";
import { Promotion } from "./components/promotion_modal/Promotion";
import { PieceColor } from "./constants/pieces";
import { useChessGameContext } from "./context/ChessGameContext";
import "./index.css";
import { Timer } from "./components/timer/Timer";
import { GameEnd } from "./components/gameend_modal/GameEnd";
import { formatTime } from "./hooks/useChessClock";
function App() {
  const game = useChessGameContext();
  const [playerColor, setPlayerColor] = useState<PieceColor>(PieceColor.WHITE);
  const handleNewGame = () => {
    game.reset();
  };
  return (
    <main className="game">
      <Timer
        time={formatTime(
          playerColor === PieceColor.WHITE ? game.blackTime : game.whiteTime,
        )}
      />
      <Chessboard playerColor={playerColor} />
      <Timer
        time={formatTime(
          playerColor === PieceColor.WHITE ? game.whiteTime : game.blackTime,
        )}
      />
      <ColorSelector value={playerColor} onChange={setPlayerColor} />
      {game.promotion.isPromoting && (
        <Promotion color={game.promotion.color} onPromote={game.promote} />
      )}
      {(game.status.type === "checkmate" ||
        game.status.type === "stalemate" ||
        game.status.type === "timeout") && (
        <GameEnd
          color={game.turn}
          status={game.status.type}
          onNewGame={handleNewGame}
        />
      )}
    </main>
  );
}
export default App;
