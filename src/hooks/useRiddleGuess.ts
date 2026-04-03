import { type ChangeEvent, type SubmitEvent, useState } from "react";
import type { Riddle } from "../App.types";
import isGuessCloseEnough from "../utils/isGuessCloseEnough";
import { useProgramData } from "./useProgramData";

type UseRiddleGuessArgs = {
  riddle: Riddle;
  decodedAnswer: string;
  shake: () => void;
  clearShake: () => void;
};

function useRiddleGuess({
  riddle,
  decodedAnswer,
  shake,
  clearShake,
}: UseRiddleGuessArgs) {
  const { activeProgram, updateActiveProgram } = useProgramData();

  const [guess, setGuess] = useState("");
  const [response, setResponse] = useState("");
  const [guessResult, setGuessResult] = useState<
    "correct" | "incorrect" | null
  >(null);

  function changeHandler(event: ChangeEvent<HTMLInputElement>) {
    setGuess(event.target.value);
  }

  function submitHandler(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isGuessCloseEnough(guess, decodedAnswer)) {
      setResponse("Access Granted.");
      setGuessResult("correct");
      clearShake();

      if (!activeProgram) return;

      updateActiveProgram({
        ...activeProgram,
        riddles: activeProgram.riddles.map((r) =>
          r.id === riddle.id ? { ...r, unlocked: true } : r,
        ),
      });
    } else {
      setResponse("Access Denied.");
      setGuessResult("incorrect");
      shake();
    }
  }

  return { guess, response, guessResult, changeHandler, submitHandler };
}

export default useRiddleGuess;
