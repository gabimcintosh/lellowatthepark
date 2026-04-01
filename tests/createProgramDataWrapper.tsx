import React from 'react';
import { ProgramDataContext } from '../src/contexts/ProgramDataContext';
import { vi } from 'vitest';

const defaultContextValue: ProgramDataContext = {
  programs: [],
  activeProgram: undefined,
  selectProgram: vi.fn(),
  updateActiveProgram: vi.fn(),
};

export function createProgramDataWrapper(overrides: Partial<ProgramDataContext> = {}) {
  const contextValue: ProgramDataContext = {
    ...defaultContextValue,
    ...overrides,
  };

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <ProgramDataContext.Provider value={contextValue}>
        {children}
      </ProgramDataContext.Provider>
    );
  }

  return { Wrapper, contextValue };
}
