import React, { ChangeEvent, FormEvent } from "react";
import { RiddleT } from "../types";
import { fuzzy } from "fast-fuzzy";

type RiddleProps = {
  riddle: RiddleT;
}

function Riddle({ riddle }: RiddleProps) {
  const [guess, setGuess] = React.useState("");

  function changeHandler(event: ChangeEvent<HTMLInputElement>) {
    setGuess(event.target.value);
  }

  function submitHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const decodedAnswer = atob(riddle.pw);
    const scoreResult = fuzzy(guess.trim(), decodedAnswer);
    if (scoreResult > 0.875) {
      alert("Access Granted.");
    }
    else {
      alert("Access Denied.");
    }
  }

  return (
    <div className="program">
      <details>
        <summary>{riddle.id}</summary>
        <form className="riddle" onSubmit={submitHandler}>
          <p className="description">{riddle.riddle}</p>
          <input type="text" placeholder="Enter password..." value={guess} onChange={changeHandler} />
        </form>
      </details>
    </div>
  );
}

export default Riddle;
