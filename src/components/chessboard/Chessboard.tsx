import "./chessboard.css";
import { rows, columns, PIECES, PieceColor } from "../../constants/pieces";
import { useChessGameContext } from "../../context/ChessGameContext";
import type React from "react";
import type { CSSProperties } from "react";
import { useState } from "react";

type ChessboardProps = {
  playerColor: PieceColor;
};

// export const Chessboard = ({ playerColor }: ChessboardProps) => {
//   const { board, legalMoves, handler, king, color } = useChessGameContext();
//   return (
//     <div>
//       <table
//         className={playerColor === PieceColor.BLACK ? "board--flipped" : ""}
//         // ref={tableRef}
//         onClick={handler.click}
//         onDrop={handler.drop}
//         onDragOver={handler.dragOver}
//         onDragEnter={handler.dragEnter}
//         onDragLeave={handler.dragLeave}
//         onDragStart={handler.dragStart}
//       >
//         <tbody>
//           {rows.map((row, i) => (
//             <tr key={row}>
//               {columns.map((column, j) => {
//                 const cellkey = `${column}${row}`;
//                 const colorSquare = (i + j) % 2 !== 0 ? "black" : "white";
//                 const piece = board[i][j];
//                 const isLegal = legalMoves.some(
//                   (move) => move.x === i && move.y === j,
//                 );
//                 const check =
//                   king[color].check.checked &&
//                   king[color].check.x === i &&
//                   king[color].check.y === j;
//                 return (
//                   <td
//                     key={cellkey}
//                     data-id={cellkey}
//                     data-row={row}
//                     data-column={column}
//                     className={`${colorSquare} ${isLegal ? "legal-move" : ""}`}
//                   >
//                     {piece && (
//                       <img
//                         src={PIECES[piece]}
//                         draggable
//                         alt=""
//                         className={check ? "square--check" : ""}
//                       />
//                     )}
//                   </td>
//                 );
//               })}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

export const Chessboard = ({ playerColor }: ChessboardProps) => {
  const [dragOverSquare, setDragOverSquare] = useState<string | null>(null);
  const [draggedSquare, setDraggedSquare] = useState<string | null>(null);
  const [moveAnimation, setMoveAnimation] = useState<{
    x: number;
    y: number;
    translateX: number;
    translateY: number;
  } | null>(null);
  const { board, turn, king, status, selected, legalMoves, select, move } =
    useChessGameContext();
  const handleDragStart = (
    event: React.DragEvent<HTMLImageElement>,
    x: number,
    y: number
  ) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("application/chess-position", `${x},${y}`);
    setDraggedSquare(`${x},${y}`);
    select({ x, y });
  };

  const handleDrop = (
    event: React.DragEvent<HTMLTableCellElement>,
    x: number,
    y: number
  ) => {
    event.preventDefault();
    setDragOverSquare(null);
    setDraggedSquare(null);
    move({ x, y });
  };
  return (
    <div>
      <table
        className={playerColor === PieceColor.BLACK ? "board--flipped" : ""}
      >
        <tbody>
          {rows.map((row, i) => (
            <tr key={row}>
              {columns.map((column, j) => {
                const cellkey = `${column}${row}`;
                const colorSquare = (i + j) % 2 !== 0 ? "black" : "white";
                const piece = board[i][j];
                const isDraggedPiece = draggedSquare === `${i},${j}`;
                const isLegal = legalMoves.some(
                  (move) => move.x === i && move.y === j
                );
                const isAnimatedDestination =
                  moveAnimation?.x === i && moveAnimation.y === j;
                const animationStyle = isAnimatedDestination
                  ? ({
                      "--move-x": moveAnimation.translateX,
                      "--move-y": moveAnimation.translateY,
                    } as CSSProperties)
                  : undefined;
                const check =
                  status.type === "check" &&
                  king[turn].x === i &&
                  king[turn].y === j;
                const checkMate =
                  status.type === "checkmate" &&
                  king[turn].x === i &&
                  king[turn].y === j;
                return (
                  <td
                    onClick={() => {
                      if (selected && isLegal) {
                        setMoveAnimation({
                          x: i,
                          y: j,
                          translateX: selected.y - j,
                          translateY: selected.x - i,
                        });
                      }
                      select({ x: i, y: j });
                    }}
                    onDrop={(event) => handleDrop(event, i, j)}
                    onDragOver={(event) => {
                      event.preventDefault();
                      setDragOverSquare(cellkey);
                    }}
                    onDragEnter={() => setDragOverSquare(cellkey)}
                    onDragLeave={() =>
                      setDragOverSquare((square) =>
                        square === cellkey ? null : square
                      )
                    }
                    key={cellkey}
                    className={`${colorSquare} ${isLegal ? "legal-move" : ""} ${
                      dragOverSquare === cellkey ? "drag-over" : ""
                    }`}
                  >
                    {piece && (
                      <img
                        onDragStart={(event) => {
                          handleDragStart(event, i, j);
                        }}
                        onDragEnd={() => {
                          setDragOverSquare(null);
                          setDraggedSquare(null);
                        }}
                        src={PIECES[piece]}
                        draggable
                        alt=""
                        style={animationStyle}
                        onAnimationEnd={() => setMoveAnimation(null)}
                        className={`${
                          check
                            ? "square--check"
                            : checkMate
                            ? "square--check-mate"
                            : ""
                        } ${isAnimatedDestination ? "piece--moving" : ""} ${
                          isDraggedPiece ? "opacity" : ""
                        }`}
                      />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
