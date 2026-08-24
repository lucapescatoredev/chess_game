import { PIECES, PieceType } from "../../constants/pieces";
import "./promotion.css";
export const Promotion = ({ color, onPromote }) => {
  const KNIGHT = `w${PieceType.KNIGHT}`;
  const BISHOP = `w${PieceType.BISHOP}`;
  const ROOK = `w${PieceType.ROOK}`;
  const QUEEN = `w${PieceType.QUEEN}`;
  return (
    <div className="overlay">
      <div
        className="modal"
        onClick={(e) => {
          const target = e.target as HTMLElement;
          const promotedPiece = target.dataset.piece;
          if (!promotedPiece) return;
          onPromote(promotedPiece);
          // onIsPromoting(false);
          // onBoardUpdate((board) => {
          //   const updatedBoard = board.map((row) => [...row]);
          //   updatedBoard[promotion.x][promotion.y] =
          //     `${promotion.color}${promotedPiece}`;
          //   pieceDropped.current = true;
          //   return [...updatedBoard];
          // });
        }}
      >
        <img className="modal-img" data-piece="N" src={PIECES[KNIGHT]}></img>
        <img className="modal-img" data-piece="B" src={PIECES[BISHOP]}></img>
        <img className="modal-img" data-piece="R" src={PIECES[ROOK]}></img>
        <img className="modal-img" data-piece="Q" src={PIECES[QUEEN]}></img>
      </div>
    </div>
  );
};
