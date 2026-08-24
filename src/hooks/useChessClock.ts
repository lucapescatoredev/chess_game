import { useCallback, useEffect, useRef, useState } from "react";
import { PieceColor } from "../constants/pieces";

const INITIAL_TIME = 10 * 60;
export function useChessClock({
  turn,
  running,
  onTimeout,
}: {
  turn: PieceColor;
  running: boolean;
  onTimeout: (color: PieceColor) => void;
}) {
  const [times, setTimes] = useState({
    [PieceColor.WHITE]: INITIAL_TIME,
    [PieceColor.BLACK]: INITIAL_TIME,
  });

  const deadlineRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) {
      deadlineRef.current = null;
      return;
    }
    deadlineRef.current = Date.now() + times[turn] * 1000;
    const update = () => {
      if (deadlineRef.current === null) return;

      const remaining = Math.max(
        0,
        Math.ceil((deadlineRef.current - Date.now()) / 1000)
      );

      setTimes((current) => ({
        ...current,
        [turn]: remaining,
      }));

      if (remaining === 0) {
        deadlineRef.current = null;
        onTimeout(turn);
      }
    };
    update();
    const intervalId = window.setInterval(update, 250);

    return () => window.clearInterval(intervalId);
  }, [turn, running, onTimeout]);

  const reset = useCallback(() => {
    deadlineRef.current = null;
    setTimes({
      [PieceColor.WHITE]: INITIAL_TIME,
      [PieceColor.BLACK]: INITIAL_TIME,
    });
  }, []);

  return { times, reset };
}
export function formatTime(time: number) {
  let minutes = String(Math.trunc(time / 60)).padStart(2, "0");
  let seconds = String(Math.trunc(time % 60)).padStart(2, "0");
  return `${minutes}:${seconds}`;
}
