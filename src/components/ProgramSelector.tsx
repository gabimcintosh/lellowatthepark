import React, { ChangeEvent } from "react";
import { ProgramT } from "../types";

type ProgramSelectorProps = {
  programs: ProgramT[];
  setProgram: any;
}

function ProgramSelector({ programs, setProgram }: ProgramSelectorProps) {
  function selectChangeHandler(event: ChangeEvent<HTMLSelectElement>) {
    setProgram(programs.find(program => program.name === event.target.value));
  }

  return (
    <div id='program-selector'>
      <select onChange={selectChangeHandler}>
        <option value="Select your program" disabled selected>Select your program</option>
        {programs.map(program => (
          <option key={program.name} value={program.name}>
            {program.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ProgramSelector;
