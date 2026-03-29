import { createContext } from "react";
import { ProgramT } from "../types";

export type ProgramDataContextT = {
    programs: ProgramT[];
    activeProgram: ProgramT | undefined;
    selectProgram: (name: string) => void;
    updateActiveProgram: (program: ProgramT) => void;
}

export const ProgramDataContext = createContext<ProgramDataContextT | null>(null);
