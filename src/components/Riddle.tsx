import React from "react";
import type { Riddle } from "../App.types";
import useRiddleGuess from "../hooks/useRiddleGuess";
import useShake from "../hooks/useShake";

type RiddleProps = {
  id: string;
  riddle: Riddle;
};

function Riddle({ id, riddle }: RiddleProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  // Answers are Base64-encoded for light obfuscation only, not security.
  const decodedAnswer = atob(riddle.pw);
  const { isShaking, shake, clearShake } = useShake();
  const { guess, response, guessResult, changeHandler, submitHandler } =
    useRiddleGuess({
      riddle,
      decodedAnswer,
      shake,
      clearShake,
    });

  const inputVal = riddle.unlocked ? `✔ ${decodedAnswer}` : guess;
  const failClass = guessResult === "incorrect" ? "fail" : "";

  function toggleHandler(event: React.ToggleEvent<HTMLDetailsElement>) {
    if (event.newState === "open") {
      inputRef.current?.focus();
    }
  }

  return (
    <div id={id} className="riddle">
      <details onToggle={toggleHandler} open={riddle.unlocked}>
        <summary>{riddle.id}</summary>
        <form
          className={isShaking ? "shake" : ""}
          onSubmit={submitHandler}
          aria-label={`${riddle.id} - enter password and press Enter to submit`}
        >
          <p className="description">{riddle.riddle}</p>
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter password..."
            value={inputVal}
            onChange={changeHandler}
            disabled={riddle.unlocked}
          />
          {response && (
            <p aria-live="polite" className={`response ${failClass}`}>
              {response}
            </p>
          )}
          {riddle.unlocked && <p className="clue">{riddle.description}</p>}
        </form>
      </details>
    </div>
  );
}

export default Riddle;
