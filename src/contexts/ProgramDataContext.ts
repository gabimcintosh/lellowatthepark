import { createContext } from "react";
import { ProgramT } from "../types";

export type ProgramDataContextT = {
    programs: ProgramT[];
    setProgram: (program: ProgramT | undefined) => void;
    setPrograms: (programs: ProgramT[]) => void;
    program: ProgramT | undefined;
}

export const ProgramDataContext = createContext<ProgramDataContextT | null>(null);
