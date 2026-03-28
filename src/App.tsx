import React, { useContext, useEffect, useState } from 'react';
import { ProgramT } from './types';
import { loadPrograms } from './dataManager';
import ProgramSelector from './components/ProgramSelector';
import Program from './components/Program';
import { ProgramDataContext } from './contexts/ProgramDataContext';

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
    <div className="app">
      <ProgramDataContext.Provider value={{ programs, setPrograms, program, setProgram }}>
        {program ? <Program program={program} /> : <ProgramSelector />}
      </ProgramDataContext.Provider>
    </div>
  );
}

export default App;
