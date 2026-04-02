import { createContext } from "react";
import type { Program } from "../App.types";

export type ProgramDataContext = {
  programs: Program[];
  activeProgram: Program | undefined;
  selectProgram: (name: string) => void;
  updateActiveProgram: (program: Program) => void;
};

export const ProgramDataContext = createContext<ProgramDataContext | null>(
  null,
);
