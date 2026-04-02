import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useProgramData } from './useProgramData';
import { createProgramDataWrapper } from '../../tests/createProgramDataWrapper';

describe('useProgramData', () => {
    const { wrapper, contextValue } = createProgramDataWrapper();

    it('throws when used outside of a ProgramDataContext.Provider', () => {
        expect(() => renderHook(() => useProgramData())).toThrow(
            'useProgramData must be used within a ProgramDataContext.Provider'
        );
    });

    it('returns the context value when used inside a Provider', () => {
        const { result } = renderHook(() => useProgramData(), { wrapper });
        expect(result.current).toBe(contextValue);
    });

    it('returns programs from context', () => {
        const { result } = renderHook(() => useProgramData(), { wrapper });
        expect(result.current.programs).toEqual([]);
    });

    it('returns selectProgram from context', () => {
        const { result } = renderHook(() => useProgramData(), { wrapper });
        expect(typeof result.current.selectProgram).toBe('function');
    });
});
