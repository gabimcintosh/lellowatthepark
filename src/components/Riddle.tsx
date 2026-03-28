import React, { ChangeEvent, FormEvent } from "react";
import { RiddleT } from "../types";
import { fuzzy } from "fast-fuzzy";
import { useProgramData } from "../hooks/useProgramData";

type RiddleProps = {
  riddle: RiddleT;
}

function Riddle({ riddle }: RiddleProps) {
  const { program, setProgram } = useProgramData();
  const [guess, setGuess] = React.useState("");
  const [response, setResponse] = React.useState("");
  const [isCorrectGuess, setIsCorrectGuess] = React.useState(true);

  function changeHandler(event: ChangeEvent<HTMLInputElement>) {
    setGuess(event.target.value);
  }

  function submitHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const decodedAnswer = atob(riddle.pw);
    const scoreResult = fuzzy(guess.trim(), decodedAnswer);
    if (scoreResult > 0.875) {
      setResponse("Access Granted.");
      setIsCorrectGuess(true);
      if (!program) {
        return;
      }
      setProgram({
        ...program,
        riddles: program.riddles.map((r) => r.id === riddle.id ? { ...r, unlocked: true } : r)
      });
    }
    else {
      setIsCorrectGuess(false);
      setResponse("Access Denied.");
    }
  }

  return (
    <div className="riddle">
      <details>
        <summary>{riddle.id}</summary>
        <form className={`${!isCorrectGuess && "shake"}`} onSubmit={submitHandler}>
          <p className="description">{riddle.riddle}</p>
          <input type="text" placeholder="Enter password..." value={`${riddle.unlocked ? '✔ ' + guess : guess}`} onChange={changeHandler} disabled={riddle.unlocked} />
          {response && <p className={`response ${!isCorrectGuess && "fail"}`}>{response}</p>}
          {riddle.unlocked && <p className="clue">{riddle.description}</p>}
        </form>
      </details>
    </div>
  );
}

export default Riddle;
