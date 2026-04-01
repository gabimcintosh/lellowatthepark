import { describe, expect, it } from "vitest";
import getRiddlesToRender from "./getRiddlesToRender";
import { Riddle } from "../App.types";

const makeRiddle = (overrides: Partial<Riddle> = {}): Riddle => ({
    id: 'test-id',
    pw: 'test-pw',
    riddle: 'default riddle',
    description: 'default description',
    unlocked: false,
    ...overrides
});

describe('getRiddlesToRender', () => {
    it('should return 0 if the first riddle is locked', () => {
        const riddles: Riddle[] = [
            makeRiddle(),
        ];
        const { riddlesToRender, nextRiddleIndex } = getRiddlesToRender(riddles);
        expect(nextRiddleIndex).toBe(0);
        expect(riddlesToRender.length).toEqual(1);
        expect(riddlesToRender).toEqual(riddles);
    });

    it('should return nextRiddleIndex: 1, 2 riddles when 1 of 3 is solved', () => {
        const riddles: Riddle[] = [
            makeRiddle({ unlocked: true }),
            makeRiddle(),
            makeRiddle(),
        ];
        const { riddlesToRender, nextRiddleIndex } = getRiddlesToRender(riddles);
        expect(nextRiddleIndex).toBe(1);
        expect(riddlesToRender.length).toEqual(2);
    });

    it('should return nextRiddleIndex: 2, 3 riddles when 2 of 3 is solved', () => {
        const riddles: Riddle[] = [
            makeRiddle({ unlocked: true }),
            makeRiddle({ unlocked: true }),
            makeRiddle(),
        ];
        const { riddlesToRender, nextRiddleIndex } = getRiddlesToRender(riddles);
        expect(nextRiddleIndex).toBe(2);
        expect(riddlesToRender.length).toEqual(3);
    });

    it('should return -1 if all riddles are solved', () => {
        const riddles: Riddle[] = [
            makeRiddle({ unlocked: true }),
        ];
        const { riddlesToRender, nextRiddleIndex } = getRiddlesToRender(riddles);
        expect(nextRiddleIndex).toBe(-1);
        expect(riddlesToRender.length).toEqual(1);
    });

    it('should return -1 if there are no riddles', () => {
        const riddles: Riddle[] = [];
        const { riddlesToRender, nextRiddleIndex } = getRiddlesToRender(riddles);
        expect(nextRiddleIndex).toBe(-1);
        expect(riddlesToRender.length).toEqual(0);
    });
});
