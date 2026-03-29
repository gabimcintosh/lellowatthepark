import React from "react";
import { ProgramT } from "../types";
import Riddle from "./Riddle";

type ProgramProps = {
  program: ProgramT;
};

function Program({ program }: ProgramProps) {
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
    target?.scrollIntoView({ behavior: "smooth" });
    setPendingScrollIndex(null);
  }, [pendingScrollIndex, program?.riddles]);

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
    </>
  );
}

export default Program;
