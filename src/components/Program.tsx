import React from "react";
import { ProgramT } from "../types";
import Riddle from "./Riddle";
import useRiddleScroll from "../hooks/useRiddleScroll";
import getRiddlesToRender from "../hooks/getRiddlesToRender";

type ProgramProps = {
  program: ProgramT;
  resetProgram: () => void;
};

function Program({ program, resetProgram }: ProgramProps) {
  const { riddlesToRender, nextRiddleIndex } = getRiddlesToRender(program.riddles);
  const { riddleRefs, handleSolve } = useRiddleScroll(program.riddles, nextRiddleIndex);
  const isComplete = nextRiddleIndex === -1;

  return (
    <>
      <h1 className='title'>{program.name}</h1>
      {riddlesToRender.map((riddle, index) =>
        <Riddle
          key={riddle.id}
          riddle={riddle}
          ref={(el) => { riddleRefs.current[index] = el; }}
          onSolve={() => handleSolve(index)}
        />
      )}
      {isComplete &&
        <div id="classic-ending">
          <h2>The End</h2>
          <button id="reset-selection" onClick={resetProgram}>Play Again?</button>
        </div>
      }
    </>
  );
}

export default Program;
