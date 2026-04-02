// src/hooks/useRiddleGuess.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React, { SubmitEvent } from 'react';
import useRiddleGuess from './useRiddleGuess';
import type { ProgramDataContext as ContextType } from '../contexts/ProgramDataContext';
import type { Riddle, Program } from '../App.types';
import { createProgramDataWrapper } from '../../tests/createProgramDataWrapper';

// ---------------------------------------------------------------------------
// Module mock
// ---------------------------------------------------------------------------

vi.mock('../utils/isGuessCloseEnough', () => ({
    default: vi.fn(),
}));

import isGuessCloseEnough from '../utils/isGuessCloseEnough';
const mockIsGuessCloseEnough = vi.mocked(isGuessCloseEnough);

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const riddle: Riddle = {
    id: 'Step 1',
    pw: btoa('secret'),
    riddle: 'What has keys?',
    description: 'A keyboard',
    unlocked: false,
};

const activeProgram: Program = {
    name: 'Alpha',
    active: true,
    riddles: [riddle, { ...riddle, id: 'Step 2', unlocked: false }],
};

// ---------------------------------------------------------------------------
// Wrapper factory
// ---------------------------------------------------------------------------

const shake = vi.fn();
const clearShake = vi.fn();

function renderGuessHook(overrides: Partial<ContextType> = {}) {
    const { wrapper, contextValue } = createProgramDataWrapper({
        activeProgram,
        ...overrides,
    });
    const { result } = renderHook(
        () => useRiddleGuess({ riddle, decodedAnswer: 'secret', shake, clearShake }),
        { wrapper }
    );
    return { result, contextValue };
}


function makeSubmitEvent() {
    return { preventDefault: vi.fn() } as unknown as SubmitEvent<HTMLFormElement>;
}

function makeChangeEvent(value: string) {
    return { target: { value } } as React.ChangeEvent<HTMLInputElement>;
}

beforeEach(() => {
    mockIsGuessCloseEnough.mockReturnValue(false);
    vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

describe('initial state', () => {
    it('starts with an empty guess', () => {
        const { result } = renderGuessHook();
        expect(result.current.guess).toBe('');
    });

    it('starts with an empty response', () => {
        const { result } = renderGuessHook();
        expect(result.current.response).toBe('');
    });

    it('starts with a null guessResult', () => {
        const { result } = renderGuessHook();
        expect(result.current.guessResult).toBeNull();
    });
});

// ---------------------------------------------------------------------------
// changeHandler
// ---------------------------------------------------------------------------

describe('changeHandler', () => {
    it('updates the guess value', () => {
        const { result } = renderGuessHook();
        act(() => result.current.changeHandler(makeChangeEvent('hello')));
        expect(result.current.guess).toBe('hello');
    });
});

// ---------------------------------------------------------------------------
// submitHandler — correct guess
// ---------------------------------------------------------------------------

describe('submitHandler with a correct guess', () => {
    beforeEach(() => {
        mockIsGuessCloseEnough.mockReturnValue(true);
    });

    it('prevents the default form submission', () => {
        const { result } = renderGuessHook();
        const event = makeSubmitEvent();
        act(() => result.current.submitHandler(event));
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('sets response to "Access Granted."', () => {
        const { result } = renderGuessHook();
        act(() => result.current.submitHandler(makeSubmitEvent()));
        expect(result.current.response).toBe('Access Granted.');
    });

    it('sets guessResult to "correct"', () => {
        const { result } = renderGuessHook();
        act(() => result.current.submitHandler(makeSubmitEvent()));
        expect(result.current.guessResult).toBe('correct');
    });

    it('calls clearShake', () => {
        const { result } = renderGuessHook();
        act(() => result.current.submitHandler(makeSubmitEvent()));
        expect(clearShake).toHaveBeenCalled();
    });

    it('calls contextValue with the riddle unlocked', () => {
        const { result, contextValue } = renderGuessHook();
        act(() => result.current.submitHandler(makeSubmitEvent()));

        expect(contextValue.updateActiveProgram).toHaveBeenCalledOnce();
        const updatedProgram: Program = vi.mocked(contextValue.updateActiveProgram).mock.calls[0][0];
        const updatedRiddle = updatedProgram.riddles.find(r => r.id === riddle.id);
        expect(updatedRiddle?.unlocked).toBe(true);
    });

    it('does not unlock other riddles', () => {
        const { result, contextValue } = renderGuessHook();
        act(() => result.current.submitHandler(makeSubmitEvent()));

        const updatedProgram: Program = vi.mocked(contextValue.updateActiveProgram).mock.calls[0][0];
        const otherRiddle = updatedProgram.riddles.find(r => r.id === 'Step 2');
        expect(otherRiddle?.unlocked).toBe(false);
    });

    it('does not call contextValue when activeProgram is undefined', () => {
        const { result, contextValue } = renderGuessHook({ activeProgram: undefined });
        act(() => result.current.submitHandler(makeSubmitEvent()));
        expect(contextValue.updateActiveProgram).not.toHaveBeenCalled();
    });
});

// ---------------------------------------------------------------------------
// submitHandler — incorrect guess
// ---------------------------------------------------------------------------

describe('submitHandler with an incorrect guess', () => {
    it('sets response to "Access Denied."', () => {
        const { result } = renderGuessHook();
        act(() => result.current.submitHandler(makeSubmitEvent()));
        expect(result.current.response).toBe('Access Denied.');
    });

    it('sets guessResult to "incorrect"', () => {
        const { result } = renderGuessHook();
        act(() => result.current.submitHandler(makeSubmitEvent()));
        expect(result.current.guessResult).toBe('incorrect');
    });

    it('calls shake', () => {
        const { result } = renderGuessHook();
        act(() => result.current.submitHandler(makeSubmitEvent()));
        expect(shake).toHaveBeenCalled();
    });

    it('does not call contextValue', () => {
        const { result, contextValue } = renderGuessHook();
        act(() => result.current.submitHandler(makeSubmitEvent()));
        expect(contextValue.updateActiveProgram).not.toHaveBeenCalled();
    });
});
