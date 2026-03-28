import React, { ChangeEvent } from "react";
import { ProgramT } from "../types";
import { useProgramData } from "../hooks/useProgramData";

function ProgramSelector() {
  const { programs, setProgram } = useProgramData();

  function selectChangeHandler(event: ChangeEvent<HTMLSelectElement>) {
    setProgram(programs.find((program: ProgramT) => program.name === event.target.value));
  }

  return (
    <div id='program-selector'>
      <select onChange={selectChangeHandler} defaultValue="">
        <option value="" disabled hidden>Select your program</option>
        {programs.map((program: ProgramT) => (
          <option key={program.name} value={program.name}>
            {program.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ProgramSelector;
