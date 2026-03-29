import { useRef, useState, useEffect } from "react";
import { RiddleT } from "../types";

const options: ScrollIntoViewOptions = { behavior: "smooth" };

function useRiddleScroll(riddles: RiddleT[], nextRiddleIndex: number) {
    const riddleRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [pendingScrollIndex, setPendingScrollIndex] = useState<number | null>(null);

    useEffect(() => {
        if (pendingScrollIndex === null) return;
        riddleRefs.current[pendingScrollIndex]?.scrollIntoView(options);
        setPendingScrollIndex(null);
    }, [pendingScrollIndex, riddles]);

    useEffect(() => {
        if (nextRiddleIndex !== -1) {
            riddleRefs.current[nextRiddleIndex]?.scrollIntoView(options);
        }
    }, []);

    function handleSolve(index: number) {
        setPendingScrollIndex(index + 1);
    }

    return { riddleRefs, handleSolve };
}

export default useRiddleScroll;
