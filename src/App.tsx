import React, { useEffect, useState } from 'react';
import { ProgramT } from './types';
import { loadPrograms } from './dataManager';
import ProgramSelector from './components/ProgramSelector';
import Program from './components/Program';

function App() {
  const [programs, setPrograms] = useState<ProgramT[]>([]);
  const [program, setProgram] = useState<ProgramT | undefined>(undefined);

  useEffect(() => {
    const loadProgramData = async () => {
      const programs = await loadPrograms();
      setPrograms(programs);
    };
    loadProgramData();
  }, []);


  return (
    <div className="App">
      {program ? (
        <Program program={program} />
      ) : (
        <ProgramSelector programs={programs} setProgram={setProgram} />
      )}
    </div>
  );
}

export default App;
