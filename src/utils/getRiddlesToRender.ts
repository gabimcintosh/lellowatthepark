import { RiddleT } from "../types";

function getRiddlesToRender(riddles: RiddleT[]) {
    const nextRiddleIndex = riddles.findIndex(r => !r.unlocked);
    const riddlesToRender = nextRiddleIndex === -1
        ? riddles
        : riddles.slice(0, nextRiddleIndex + 1);

    return { riddlesToRender, nextRiddleIndex };
}

export default getRiddlesToRender;
