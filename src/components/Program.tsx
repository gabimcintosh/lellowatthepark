import React from "react";
import { ProgramT } from "../types";
import Riddle from "./Riddle";

const options: ScrollIntoViewOptions = { behavior: 'smooth' };

type ProgramProps = {
  program: ProgramT;
  resetProgram: () => void;
};

function Program({ program, resetProgram }: ProgramProps) {
  const riddleRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const [pendingScrollIndex, setPendingScrollIndex] = React.useState<number | null>(null);

  function handleSolve(index: number) {
    setPendingScrollIndex(index + 1);
  }

  // Find the index of the first riddle which is not unlocked
  const nextRiddleIndex = program.riddles.findIndex(r => !r.unlocked);
  // The riddles to render are all the riddles which are unlocked, plus the next riddle
  const riddlesToRender = program.riddles.filter((_, index) =>
    index < nextRiddleIndex || nextRiddleIndex === -1
  );

  // Add the current active riddle if one exists
  if (nextRiddleIndex !== -1) {
    riddlesToRender.push(program.riddles[nextRiddleIndex]);
  }

  React.useEffect(() => {
    if (pendingScrollIndex === null) {
      return;
    }

    const target = riddleRefs.current[pendingScrollIndex];
    target?.scrollIntoView(options);
    setPendingScrollIndex(null);
  }, [pendingScrollIndex, program?.riddles]);

  React.useEffect(() => {
    if (nextRiddleIndex !== -1) {
      riddleRefs.current[nextRiddleIndex]?.scrollIntoView(options);
    }
  }, []);

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
      {nextRiddleIndex === -1 &&
        <div id="classic-ending">
          <h2>The End</h2>
          <button id="reset-selection" onClick={resetProgram}>Play Again?</button>
        </div>
      }
    </>
  );
}

export default Program;
