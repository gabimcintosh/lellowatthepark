import React, { useMemo } from "react";
import { ProgramT } from "../types";
import Riddle from "./Riddle";
import useRiddleScroll from "../hooks/useRiddleScroll";
import getRiddlesToRender from "../utils/getRiddlesToRender";

type ProgramProps = {
  program: ProgramT;
  resetProgram: () => void;
};

function Program({ program, resetProgram }: ProgramProps) {
  const { riddlesToRender, nextRiddleIndex } = useMemo(
    () => getRiddlesToRender(program.riddles),
    [program.riddles]
  );

  useRiddleScroll(nextRiddleIndex);

  const isTheEnd = nextRiddleIndex === -1;

  return (
    <>
      <h1 className='title'>{program.name}</h1>
      {riddlesToRender.map((riddle, index) =>
        <Riddle
          key={riddle.id}
          id={`riddle-${index}`}
          riddle={riddle}
        />
      )}
      {isTheEnd &&
        <div id="classic-ending">
          <h2>The End</h2>
          <button id="reset-selection" onClick={resetProgram}>Play Again?</button>
        </div>
      }
    </>
  );
}

export default Program;
