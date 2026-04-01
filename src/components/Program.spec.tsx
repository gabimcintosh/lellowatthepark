// src/components/Program.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import Program from './Program';
import type { Program as ProgramType } from '../App.types';

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------

vi.mock('../hooks/useProgressionScroll', () => ({
  default: vi.fn(),
}));

vi.mock('../utils/getRiddlesToRender', () => ({
  default: vi.fn(),
}));

// Mock Riddle so Program tests are not dependent on Riddle's internals
vi.mock('./Riddle', () => ({
  default: ({ id, riddle }: { id: string; riddle: { id: string } }) => (
    <div data-testid={id}>Riddle: {riddle.id}</div>
  ),
}));

import useProgressionScroll from '../hooks/useProgressionScroll';
import getRiddlesToRender from '../utils/getRiddlesToRender';

const mockGetRiddlesToRender = vi.mocked(getRiddlesToRender);

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const riddles = [
  { id: 'Step 1', pw: 'abc', riddle: 'Q1', description: 'A1', unlocked: true },
  { id: 'Step 2', pw: 'def', riddle: 'Q2', description: 'A2', unlocked: false },
];

const program: ProgramType = {
  name: 'Test Adventure',
  active: true,
  riddles,
};

beforeEach(() => {
  vi.mocked(useProgressionScroll).mockImplementation(() => { });
  // By default return both riddles with a next index
  mockGetRiddlesToRender.mockReturnValue({
    riddlesToRender: riddles,
    nextRiddleIndex: 1,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe('rendering', () => {
  it('renders the program name as a heading', () => {
    render(<Program program={program} resetProgram={vi.fn()} />);
    expect(screen.getByRole('heading', { name: 'Test Adventure' })).toBeInTheDocument();
  });

  it('renders each riddle returned by getRiddlesToRender', () => {
    render(<Program program={program} resetProgram={vi.fn()} />);
    expect(screen.getByTestId('riddle-0')).toBeInTheDocument();
    expect(screen.getByTestId('riddle-1')).toBeInTheDocument();
  });

  it('passes the correct id prop to each Riddle', () => {
    render(<Program program={program} resetProgram={vi.fn()} />);
    expect(screen.getByText('Riddle: Step 1')).toBeInTheDocument();
    expect(screen.getByText('Riddle: Step 2')).toBeInTheDocument();
  });

  it('calls getRiddlesToRender with the program riddles', () => {
    render(<Program program={program} resetProgram={vi.fn()} />);
    expect(mockGetRiddlesToRender).toHaveBeenCalledWith(program.riddles);
  });
});

// ---------------------------------------------------------------------------
// End-game state (nextRiddleIndex === -1)
// ---------------------------------------------------------------------------

describe('when the game is finished (nextRiddleIndex === -1)', () => {
  beforeEach(() => {
    mockGetRiddlesToRender.mockReturnValue({
      riddlesToRender: riddles,
      nextRiddleIndex: -1,
    });
  });

  it('renders the "The End" heading', () => {
    render(<Program program={program} resetProgram={vi.fn()} />);
    expect(screen.getByRole('heading', { name: 'The End' })).toBeInTheDocument();
  });

  it('renders the "Play Again?" button', () => {
    render(<Program program={program} resetProgram={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Play Again?' })).toBeInTheDocument();
  });

  it('calls resetProgram when "Play Again?" is clicked', async () => {
    const user = userEvent.setup();
    const resetProgram = vi.fn();

    render(<Program program={program} resetProgram={resetProgram} />);
    await user.click(screen.getByRole('button', { name: 'Play Again?' }));

    expect(resetProgram).toHaveBeenCalledOnce();
  });
});

// ---------------------------------------------------------------------------
// In-progress state
// ---------------------------------------------------------------------------

describe('when the game is in progress (nextRiddleIndex !== -1)', () => {
  it('does not render the end screen', () => {
    render(<Program program={program} resetProgram={vi.fn()} />);
    expect(screen.queryByText('The End')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Play Again?' })).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// useProgressionScroll integration
// ---------------------------------------------------------------------------

describe('useProgressionScroll', () => {
  it('is called with the nextRiddleIndex from getRiddlesToRender', () => {
    mockGetRiddlesToRender.mockReturnValue({ riddlesToRender: riddles, nextRiddleIndex: 1 });
    render(<Program program={program} resetProgram={vi.fn()} />);
    expect(useProgressionScroll).toHaveBeenCalledWith(1);
  });
});
