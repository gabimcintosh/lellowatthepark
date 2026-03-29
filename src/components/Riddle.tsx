import React, { ChangeEvent, FormEvent } from "react";
import { RiddleT } from "../types";
import { fuzzy } from "fast-fuzzy";
import { useProgramData } from "../hooks/useProgramData";
import { ToggleState } from "../enums";

type RiddleProps = {
  riddle: RiddleT;
  onSolve: () => void;
}

const Riddle = React.forwardRef<HTMLDivElement, RiddleProps>(
  function Riddle({ riddle, onSolve }, ref) {
    const { program, setProgram } = useProgramData();
    const [guess, setGuess] = React.useState("");
    const [response, setResponse] = React.useState("");
    const [isCorrectGuess, setIsCorrectGuess] = React.useState(true);
    const [isShaking, setIsShaking] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    function changeHandler(event: ChangeEvent<HTMLInputElement>) {
      setGuess(event.target.value);
    }

    function toggleHandler(event: React.ToggleEvent<HTMLDetailsElement>) {
      if (event.newState === ToggleState.OPEN) {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }

    function submitHandler(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const decodedAnswer = atob(riddle.pw);
      const scoreResult = fuzzy(guess.trim(), decodedAnswer);
      if (scoreResult > 0.875) {
        setResponse("Access Granted.");
        setIsCorrectGuess(true);
        setIsShaking(false);
        if (!program) {
          return;
        }
        setProgram({
          ...program,
          riddles: program.riddles.map((r) => r.id === riddle.id ? { ...r, unlocked: true } : r)
        });
        onSolve();
      }
      else {
        setResponse("Access Denied.");
        setIsCorrectGuess(false);
        setIsShaking(true);
      }
    }

    React.useEffect(() => {
      if (isShaking) {
        const timer = setTimeout(() => setIsShaking(false), 400);
        return () => clearTimeout(timer);
      }
    }, [isShaking]);

    return (
      <div ref={ref} className="riddle">
        <details onToggle={toggleHandler} open={riddle.unlocked}>
          <summary>{riddle.id}</summary>
          <form className={`${isShaking ? "shake" : ""}`} onSubmit={submitHandler}>
            <p className="description">{riddle.riddle}</p>
            <input ref={inputRef} type="text" placeholder="Enter password..." value={`${riddle.unlocked ? '✔ ' + guess : guess}`} onChange={changeHandler} disabled={riddle.unlocked} />
            {response && <p className={`response ${!isCorrectGuess ? "fail" : ""}`}>{response}</p>}
            {riddle.unlocked && <p className="clue">{riddle.description}</p>}
          </form>
        </details>
      </div>
    );
  }
);

export default Riddle;
