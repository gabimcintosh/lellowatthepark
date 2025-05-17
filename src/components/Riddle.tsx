import React from "react";
import { RiddleT } from "../types";

type RiddleProps = {
  riddle: RiddleT;
}

function Riddle({ riddle }: RiddleProps) {

  return (
    <div className="program">
      <details>
        <summary>{riddle.id}</summary>
        <div className="riddle">
          <p className="description">{riddle.riddle}</p>
          <input type="text" placeholder="Enter password..." />
        </div>
      </details>
    </div>
  );
}

export default Riddle;
