import React from 'react';
import ProgramSelector from './components/ProgramSelector';
import Program from './components/Program';
import { ProgramDataContext } from './contexts/ProgramDataContext';
import useProgramStorage from './hooks/useProgramStorage';

function App() {
  const { programs, setPrograms, program, setProgram, isLoading, resetProgram } = useProgramStorage();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <ProgramDataContext.Provider value={{ programs, setPrograms, program, setProgram }}>
        {program ? <Program program={program} resetProgram={resetProgram} /> : <ProgramSelector />}
      </ProgramDataContext.Provider>
    </div>
  );
}

export default App;
