import React, { useEffect, useState } from 'react';
import { ProgramT } from './types';
import { loadPrograms } from './dataManager';

function App() {
  const [programs, setPrograms] = useState<ProgramT[]>([]);

  useEffect(() => {
    const loadProgramData = async () => {
      const programs = await loadPrograms();
      setPrograms(programs);
    };
    loadProgramData();
  }, []);


  return (
    <div className="App">
      {programs && JSON.stringify(programs)}
    </div>
  );
}

export default App;
