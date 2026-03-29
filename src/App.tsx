import React, { useMemo } from 'react';
import ProgramSelector from './components/ProgramSelector';
import Program from './components/Program';
import { ProgramDataContext } from './contexts/ProgramDataContext';
import useProgramStorage from './hooks/useProgramStorage';

function App() {
  const {
    programs,
    activeProgram,
    isLoading,
    selectProgram,
    updateActiveProgram,
    resetProgram
  } = useProgramStorage();

  const contextValue = useMemo(() => ({
    programs,
    activeProgram,
    selectProgram,
    updateActiveProgram
  }), [programs, activeProgram, selectProgram, updateActiveProgram]);

  if (isLoading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="app">
      <ProgramDataContext.Provider value={contextValue}>
        {activeProgram ? (
          <Program program={activeProgram} resetProgram={resetProgram} />
        ) : (
          <ProgramSelector />
        )}
      </ProgramDataContext.Provider>
    </div>
  );
}

export default App;
