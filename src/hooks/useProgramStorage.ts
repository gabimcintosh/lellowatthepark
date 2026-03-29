import { useState, useEffect } from "react";
import { ProgramT } from "../types";
import { loadPrograms, savePrograms } from "../dataManager";

function useProgramStorage() {
    const [programs, setPrograms] = useState<ProgramT[]>([]);
    const [program, setProgram] = useState<ProgramT | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const loadProgramData = async () => {
            const programs = await loadPrograms();
            if (!cancelled) {
                setPrograms(programs);
                setProgram(programs.find(p => p.active));
                setIsLoading(false);
            }
        };

        loadProgramData();
        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        if (!program) return;

        const saveProgramData = async () => {
            const updatedPrograms = programs.map(p =>
                p.name === program.name ? program : p
            );
            await savePrograms(updatedPrograms);
        };

        saveProgramData();
    }, [program]);

    function resetProgram() {
        if (!program) return;
        setProgram({
            ...program,
            riddles: program.riddles.map(r => ({ ...r, unlocked: false })),
        });
    }

    return { programs, setPrograms, program, setProgram, isLoading, resetProgram };
}

export default useProgramStorage;
