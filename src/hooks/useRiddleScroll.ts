import { useEffect } from "react";

const options: ScrollIntoViewOptions = { behavior: "smooth" };

function useRiddleScroll(nextRiddleIndex: number) {
    useEffect(() => {
        if (nextRiddleIndex === -1) return;

        const nextRiddleElement = document.getElementById(`riddle-${nextRiddleIndex}`);

        if (nextRiddleElement) {
            nextRiddleElement.scrollIntoView(options);
        }

    }, [nextRiddleIndex]);
}

export default useRiddleScroll;
