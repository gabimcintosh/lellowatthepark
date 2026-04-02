import { useMemo } from "react";
import type { Program } from "../App.types";
import useProgressionScroll from "../hooks/useProgressionScroll";
import getRiddlesToRender from "../utils/getRiddlesToRender";
import Riddle from "./Riddle";

type ProgramProps = {
  program: Program;
  resetProgram: () => void;
};

function Program({ program, resetProgram }: ProgramProps) {
  const { riddlesToRender, nextRiddleIndex } = useMemo(
    () => getRiddlesToRender(program.riddles),
    [program.riddles],
  );

  useProgressionScroll(nextRiddleIndex);

  const isTheEnd = nextRiddleIndex === -1;

  return (
    <>
      <h1 className="title">{program.name}</h1>
      {riddlesToRender.map((riddle, index) => (
        <Riddle key={riddle.id} id={`riddle-${index}`} riddle={riddle} />
      ))}
      {isTheEnd && (
        <div id="classic-ending">
          <h2>The End</h2>
          <button type="button" id="reset-selection" onClick={resetProgram}>
            Play Again?
          </button>
        </div>
      )}
    </>
  );
}

export default Program;
