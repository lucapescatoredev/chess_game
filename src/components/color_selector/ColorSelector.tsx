import { PieceColor } from "../../constants/pieces";
import "./colorSelector.css";

type ColorSelectorProps = {
  value: PieceColor;
  onChange: (color: PieceColor) => void;
};

export const ColorSelector = ({ value, onChange }: ColorSelectorProps) => (
  <div className="color-selector" aria-label="Choose your pieces color">
    <span>Play as</span>
    <button
      type="button"
      className={value === PieceColor.WHITE ? "selected" : ""}
      aria-pressed={value === PieceColor.WHITE}
      onClick={() => onChange(PieceColor.WHITE)}
    >
      White
    </button>
    <button
      type="button"
      className={value === PieceColor.BLACK ? "selected" : ""}
      aria-pressed={value === PieceColor.BLACK}
      onClick={() => onChange(PieceColor.BLACK)}
    >
      Black
    </button>
  </div>
);
