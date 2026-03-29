import { useState, useEffect, useCallback } from "react";
import { ProgramT } from "../types";
import { loadPrograms, savePrograms } from "../utils/dataManager";

function useProgramStorage() {
    const [programs, setPrograms] = useState<ProgramT[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const activeProgram = programs.find(p => p.active);

    useEffect(() => {
        let cancelled = false;

        const loadProgramData = async () => {
            const loadedPrograms = await loadPrograms();
            if (!cancelled) {
                setPrograms(loadedPrograms);
                setIsLoading(false);
            }
        };

        loadProgramData();
        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        if (isLoading) return;

        savePrograms(programs).catch(console.error);
    }, [programs, isLoading]);

    const selectProgram = useCallback((programName: string) => {
        setPrograms(prev => prev.map(p => ({
            ...p,
            active: p.name === programName
        })));
    }, []);

    const updateActiveProgram = useCallback((updatedProgram: ProgramT) => {
        setPrograms(prev => prev.map(p =>
            p.name === updatedProgram.name ? updatedProgram : p
        ));
    }, []);

    const resetProgram = useCallback(() => {
        setPrograms(prev => prev.map(p => {
            if (!p.active) return p;
            return {
                ...p,
                riddles: p.riddles.map(r => ({ ...r, unlocked: false })),
            };
        }));
    }, []);

    return {
        programs,
        activeProgram,
        isLoading,
        selectProgram,
        updateActiveProgram,
        resetProgram
    };
}

export default useProgramStorage;
