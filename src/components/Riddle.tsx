import React from "react";
import { RiddleT } from "../types";
import { ToggleState } from "../enums";
import useShake from "../hooks/useShake";
import useRiddleGuess from "../hooks/useRiddleGuess";

type RiddleProps = {
  riddle: RiddleT;
  onSolve: () => void;
};

const Riddle = React.forwardRef<HTMLDivElement, RiddleProps>(
  function Riddle({ riddle, onSolve }, ref) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const decodedAnswer = atob(riddle.pw);
    const { isShaking, shake, clearShake } = useShake();
    const { guess, response, isCorrectGuess, changeHandler, submitHandler } = useRiddleGuess({
      riddle,
      decodedAnswer,
      onSolve,
      shake,
      clearShake,
    });

    const inputVal = riddle.unlocked ? `✔ ${decodedAnswer}` : guess;

    function toggleHandler(event: React.ToggleEvent<HTMLDetailsElement>) {
      if (event.newState === ToggleState.OPEN) {
        inputRef.current?.focus();
      }
    }

    return (
      <div ref={ref} className="riddle">
        <details onToggle={toggleHandler} open={riddle.unlocked}>
          <summary>{riddle.id}</summary>
          <form className={isShaking ? "shake" : ""} onSubmit={submitHandler}>
            <p className="description">{riddle.riddle}</p>
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter password..."
              value={inputVal}
              onChange={changeHandler}
              disabled={riddle.unlocked}
            />
            {response && <p className={`response ${!isCorrectGuess ? "fail" : ""}`}>{response}</p>}
            {riddle.unlocked && <p className="clue">{riddle.description}</p>}
          </form>
        </details>
      </div>
    );
  }
);

export default Riddle;
