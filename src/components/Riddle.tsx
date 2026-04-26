import React from "react";
import type { Riddle as RiddleType } from "../App.types";
import useRiddleGuess from "../hooks/useRiddleGuess";
import useShake from "../hooks/useShake";

type RiddleProps = {
  id: string;
  riddle: RiddleType;
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
    <div
      id={id}
      className={isShaking ? "riddle shake" : "riddle"}
      data-testid={id}
    >
      <details onToggle={toggleHandler} open={riddle.unlocked}>
        <summary>{riddle.id}</summary>
        <form
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
