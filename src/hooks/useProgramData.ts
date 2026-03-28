import { useContext } from "react";
import { ProgramDataContext, ProgramDataContextT } from "../contexts/ProgramDataContext";

export function useProgramData(): ProgramDataContextT {
    const ctx = useContext(ProgramDataContext);
    if (!ctx) {
        throw new Error("useProgramData must be used within a ProgramDataContext.Provider");
    }

    return ctx;
}
