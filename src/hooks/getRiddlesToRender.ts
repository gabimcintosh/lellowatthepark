import { RiddleT } from "../types";

function getRiddlesToRender(riddles: RiddleT[]): { riddlesToRender: RiddleT[], nextRiddleIndex: number } {
    const nextRiddleIndex = riddles.findIndex(r => !r.unlocked);
    const riddlesToRender = riddles.filter((_, index) =>
        index < nextRiddleIndex || nextRiddleIndex === -1
    );

    if (nextRiddleIndex !== -1) {
        riddlesToRender.push(riddles[nextRiddleIndex]);
    }

    return { riddlesToRender, nextRiddleIndex };
}

export default getRiddlesToRender;
