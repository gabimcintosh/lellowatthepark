import React from "react";
import { ProgramT } from "../types";
import Riddle from "./Riddle";

type ProgramProps = {
  program: ProgramT;
};

function Program({ program }: ProgramProps) {
  return (
    <>
      <h1 className='title'>{program.name}</h1>
      {program.riddles.map(riddle => <Riddle key={riddle.id} riddle={riddle} />)}
    </>
  );
}

export default Program;
