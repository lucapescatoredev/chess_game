import { PIECES, PieceType } from "../../constants/pieces";
import "./promotion.css";
export const Promotion = ({ color, onPromote }) => {
  const KNIGHT = `${color}${PieceType.KNIGHT}`;
  const BISHOP = `${color}${PieceType.BISHOP}`;
  const ROOK = `${color}${PieceType.ROOK}`;
  const QUEEN = `${color}${PieceType.QUEEN}`;
  return (
    <div className="overlay">
      <div
        className="modal"
        onClick={(e) => {
          const target = e.target as HTMLElement;
          const promotedPiece = target.dataset.piece;
          if (!promotedPiece) return;
          onPromote(promotedPiece);
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
