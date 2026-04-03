// src/components/ProgramSelector.test.tsx

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import type { Program } from "../App.types";
import type { ProgramDataContext as ProgramDataContextType } from "../contexts/ProgramDataContext";
import { ProgramDataContext } from "../contexts/ProgramDataContext";
import ProgramSelector from "./ProgramSelector";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const programs: Program[] = [
  { name: "Alpha", active: false, riddles: [] },
  { name: "Beta", active: false, riddles: [] },
];

function renderWithContext(overrides: Partial<ProgramDataContextType> = {}) {
  const selectProgram = vi.fn();
  const contextValue: ProgramDataContextType = {
    programs,
    activeProgram: undefined,
    selectProgram,
    updateActiveProgram: vi.fn(),
    ...overrides,
  };

  render(
    <ProgramDataContext.Provider value={contextValue}>
      <ProgramSelector />
    </ProgramDataContext.Provider>,
  );

  return { selectProgram };
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe("rendering", () => {
  it("renders the placeholder option", () => {
    renderWithContext();
    expect(screen.getByText("Select your program")).toBeInTheDocument();
  });

  it("renders an option for each program", () => {
    renderWithContext();
    expect(screen.getByRole("option", { name: "Alpha" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Beta" })).toBeInTheDocument();
  });

  it("renders the correct number of selectable options", () => {
    renderWithContext();
    // You might think there should be placeholder + 2 programs = 3 options,
    // but the placeholder is not selectable, so subtract 1
    expect(screen.getAllByRole("option")).toHaveLength(2);
  });

  it("renders no program options when the programs list is empty", () => {
    renderWithContext({ programs: [] });
    expect(screen.getAllByText("Select your program")).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// Interaction
// ---------------------------------------------------------------------------

describe("selecting a program", () => {
  it("calls selectProgram with the chosen program name", async () => {
    const user = userEvent.setup();
    const { selectProgram } = renderWithContext();

    await user.selectOptions(screen.getByRole("combobox"), "Beta");

    expect(selectProgram).toHaveBeenCalledWith("Beta");
  });

  it("calls selectProgram once per selection change", async () => {
    const user = userEvent.setup();
    const { selectProgram } = renderWithContext();

    await user.selectOptions(screen.getByRole("combobox"), "Alpha");
    await user.selectOptions(screen.getByRole("combobox"), "Beta");

    expect(selectProgram).toHaveBeenCalledTimes(2);
  });
});
