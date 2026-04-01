import { useState, useEffect, useCallback } from "react";
import type { Program } from "../App.types";
import { loadPrograms, savePrograms } from "../utils/dataManager";

function useProgramStorage() {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const activeProgram = programs.find(p => p.active);

    useEffect(() => {
        let cancelled = false;

        const loadProgramData = async () => {
            try {
                const loadedPrograms = await loadPrograms();
                if (!cancelled) {
                    setPrograms(loadedPrograms);
                }
            } catch (err) {
                console.error("Failed to load programs:", err);
                setError(err as Error);
            } finally {
                if (!cancelled) setIsLoading(false);
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

    const updateActiveProgram = useCallback((updatedProgram: Program) => {
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
        error,
        isLoading,
        selectProgram,
        updateActiveProgram,
        resetProgram
    };
}

export default useProgramStorage;
