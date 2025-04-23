import { ProgramT } from "./types";
import programsJson from "./programs.json";
import { ToggleState, DomId, CssSelector, ClassListId } from "./enums";

const programs: ProgramT[] = programsJson as ProgramT[];
const container = document.getElementById(DomId.PROGRAMS) as HTMLDivElement;
const programTmpl = document.getElementById(DomId.PROGRAM_TMPL) as HTMLTemplateElement;
const options: ScrollIntoViewOptions = { behavior: 'smooth' };

/**
 * Update the UI to give feedback that the user's answer is correct
 * 
 * @param {HTMLDivElement} riddle The element containing the current riddle
 * @param {Object} program The data for the current riddle for updating
 * @param {number} nextProgramIndex Represents the number of the next program to render
 */
const grantReward = (riddle: HTMLDivElement, program: ProgramT, nextProgramIndex: number) => {
  const input = riddle.querySelector(CssSelector.INPUT) as HTMLInputElement;
  const response = riddle.querySelector(CssSelector.RESPONSE) as HTMLDivElement;
  const description = riddle.querySelector(CssSelector.DESCRIPTION) as HTMLParagraphElement;
  const classicEnding = document.getElementById(DomId.CLASSIC_ENDING) as HTMLHeadingElement;

  response.textContent = 'Access Granted.';
  response.classList.remove(ClassListId.FAIL);
  description.textContent = program.description;
  input.value = `✔ ${input.value}`;
  input.disabled = true;
  if (nextProgramIndex < programs.length) {
    renderProgram(nextProgramIndex);
  }
  else {
    classicEnding.classList.remove(ClassListId.HIDE);
    description.scrollIntoView(options);
  }
}

/**
 * Update the UI to give feedback that the user's answer is incorrect
 * 
 * @param {HTMLDivElement} riddle The element containing the current riddle
 */
const grantPunishment = (riddle: HTMLDivElement) => {
  const response = riddle.querySelector(CssSelector.RESPONSE) as HTMLParagraphElement;

  response.textContent = 'Access Denied.';
  response.classList.add(ClassListId.FAIL);
  riddle.classList.add(ClassListId.SHAKE);
  setTimeout(() => riddle.classList.remove(ClassListId.SHAKE), 400);
};

/**
 * Verify if the user has answered the riddle correctly
 * 
 * @param {number} programIndex Represents number of the currently rendered program
 * @param {KeyboardEvent} e The keydown event which triggered the check to grade the answer
 */
const gradeAnswer = (programIndex: number, e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    const input = e.target as HTMLInputElement;
    const program = programs[programIndex];
    const guess = input.value.trim();
    // Find the div containing the current riddle
    const riddle = input.closest(CssSelector.RIDDLE) as HTMLDivElement;
    const decodedAnswer = atob(program.pw);

    if (guess === decodedAnswer) {
      grantReward(riddle, program, programIndex + 1);
    } else {
      grantPunishment(riddle);
    }
  }
};

/**
 * Render a single program onto the page
 * 
 * @param {number} programIndex Which program to render of the list
 */
const renderProgram = (programIndex: number = 0) => {
  const programData = programs[programIndex];
  const programClone = programTmpl.content.cloneNode(true) as HTMLElement;

  const riddleDetails = programClone.querySelector(CssSelector.DETAILS) as HTMLDetailsElement;
  const riddleSummary = riddleDetails.querySelector(CssSelector.SUMMARY) as HTMLHeadingElement;
  const input = riddleDetails.querySelector(CssSelector.INPUT) as HTMLInputElement;
  const riddleP = riddleDetails.querySelector(CssSelector.CLUE) as HTMLParagraphElement;

  riddleDetails.addEventListener('toggle', (e: Event) => {
    const toggleEvent = e as ToggleEvent;
    if (toggleEvent.newState === ToggleState.OPEN) {
      input.focus();
    }
  });

  riddleSummary.textContent = programData.id;

  // Bind the keydown event listener with the program index for simpler lookup
  input.addEventListener('keydown', gradeAnswer.bind(null, programIndex));

  riddleP.textContent = programData.riddle;

  container.appendChild(programClone);
  // Smoothly scroll to the current riddle to solve
  riddleDetails.scrollIntoView(options);
};

// Render the first program once the page has loaded
renderProgram();
