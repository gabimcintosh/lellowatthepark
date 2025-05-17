import React from "react";
import { ProgramT } from "../types";

type ProgramProps = {
  program: ProgramT;
};

function Program({ program }: ProgramProps) {
  return (
    <div className="program">
      <h3>{program.name}</h3>
      <p>{program.active}</p>
    </div>
  );
}

export default Program;
