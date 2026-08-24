import { useCallback, useEffect, useReducer, useRef } from "react";
import { initialBoard } from "../logic/board";
import { PieceColor } from "../constants/pieces";
import { kingStartingPosition } from "../logic/moves/king";
import { enPassantStarting } from "../logic/moves/pawn";
import {
  playMove,
  promotePawn,
  selectSquare,
  setTimeoutState,
} from "../logic/game";
import type {
  GameAction,
  GameSound,
  GameState,
  Position,
  PromotionPiece,
} from "../logic/types";
import moveSoundUrl from "../sounds/move.mp3";
import checkSoundUrl from "../sounds/check.mp3";
import captureSoundUrl from "../sounds/capture.mp3";
import illegalSoundUrl from "../sounds/illegal.mp3";
import castleSoundUrl from "../sounds/castle.mp3";
import gameEndSoundUrl from "../sounds/game-end.mp3";
import { useChessClock } from "./useChessClock";

const initialState: GameState = {
  board: initialBoard,
  turn: PieceColor.WHITE,
  king: kingStartingPosition,
  enPassant: enPassantStarting,
  selected: null,
  legalMoves: [],
  castling: {
    color: "",
    canCastle: false,
    canCastleKingSide: false,
    canCastleQueenSide: false,
  },
  promotion: {
    isPromoting: false,
    x: -1,
    y: -1,
    color: null,
  },
  status: {
    type: "playing",
  },
  sound: "move",
};
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "select":
      return selectSquare(state, action.position);
    case "move":
      return playMove(state, action.position);
    case "promote":
      return promotePawn(state, action.piece);
    case "timeout":
      return setTimeoutState(state);
    case "reset":
      return initialState;
    default:
      return state;
  }
};

/* Previous HTMLAudioElement implementation:
const playSound = ({ audio }: { audio: HTMLAudioElement }) => {
  audio.pause();
  audio.currentTime = 0;
  audio.play().catch((error) => {
    console.error("Audio play error:", error);
  });
};
*/

const soundUrls: Record<GameSound, string> = {
  move: moveSoundUrl,
  capture: captureSoundUrl,
  castling: castleSoundUrl,
  check: checkSoundUrl,
  illegal: illegalSoundUrl,
  gameEnd: gameEndSoundUrl,
};

const playGameSound = ({
  state,
  newState,
  playSound,
  skipIllegalAudio = false,
}: {
  state: GameState;
  newState: GameState;
  playSound: (sound: GameSound) => void;
  skipIllegalAudio?: boolean;
}) => {
  if (state.board === newState.board) {
    if (!skipIllegalAudio) playSound("illegal");
    return;
  }

  const soundByGameState: Partial<Record<string, GameSound>> = {
    playing: "move",
    capture: "capture",
    castling: "castling",
    check: "check",
  };
  const sound = soundByGameState[newState.sound];
  if (sound) playSound(sound);
};
export function useChessGame() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  /*Better audio moves implementation - using Audio Context API ***************************/
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBuffersRef = useRef<Partial<Record<GameSound, AudioBuffer>>>({});
  const activeSourcesRef = useRef(new Set<AudioBufferSourceNode>());
  const buffersReadyRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    const audioContext = new AudioContext();
    const activeSources = activeSourcesRef.current;
    audioContextRef.current = audioContext;

    buffersReadyRef.current = Promise.all(
      Object.entries(soundUrls).map(async ([sound, url]) => {
        const response = await fetch(url);
        const data = await response.arrayBuffer();
        const buffer = await audioContext.decodeAudioData(data);
        if (audioContextRef.current === audioContext) {
          audioBuffersRef.current[sound as GameSound] = buffer;
        }
      })
    )
      .then(() => undefined)
      .catch((error) => {
        if (audioContextRef.current === audioContext) {
          console.error("Audio loading error:", error);
        }
      });

    return () => {
      for (const source of activeSources) source.stop();
      activeSources.clear();
      audioContext.close();
      audioContextRef.current = null;
      audioBuffersRef.current = {};
    };
  }, []);

  const playSound = useCallback(async (sound: GameSound) => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;
    try {
      if (audioContext.state === "suspended") await audioContext.resume();
      await buffersReadyRef.current;

      const buffer = audioBuffersRef.current[sound];
      if (!buffer || audioContext.state === "closed") return;

      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      activeSourcesRef.current.add(source);
      source.addEventListener("ended", () => {
        activeSourcesRef.current.delete(source);
      });
      source.start();
    } catch (error) {
      console.error("Audio play error:", error);
    }
  }, []);

  const handleTimeout = useCallback((color: PieceColor) => {
    dispatch({ type: "timeout", color });
  }, []);

  const clock = useChessClock({
    turn: state.turn,
    running: state.status.type === "playing",
    onTimeout: handleTimeout,
  });

  useEffect(() => {
    if (state.status.type === "checkmate") {
      playSound("gameEnd");
    }
  }, [state.status.type, playSound]);

  return {
    ...state,
    whiteTime: clock.times[PieceColor.WHITE],
    blackTime: clock.times[PieceColor.BLACK],
    select(position: Position) {
      const nextState = selectSquare(state, position);
      playGameSound({
        state,
        newState: nextState,
        playSound,
        skipIllegalAudio: true,
      });
      dispatch({ type: "select", position });
    },
    move(position: Position) {
      const nextState = playMove(state, position);
      playGameSound({ state, newState: nextState, playSound });
      dispatch({ type: "move", position });
    },
    promote(piece: PromotionPiece) {
      dispatch({ type: "promote", piece });
    },
    reset() {
      clock.reset();
      for (const source of activeSourcesRef.current) source.stop();
      activeSourcesRef.current.clear();
      dispatch({ type: "reset" });
    },
  };
}
