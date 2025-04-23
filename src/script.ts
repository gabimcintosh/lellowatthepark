import { ProgramT } from "./types";
import programsJson from "./programs.json";

const programs: ProgramT[] = programsJson as ProgramT[];
const container = document.getElementById('programs') as HTMLDivElement;
const programTmpl = document.querySelector('#program-tmpl') as HTMLTemplateElement;
const options: ScrollIntoViewOptions = { behavior: 'smooth' };

/**
 * Update the UI to give feedback that the user's answer is correct
 * 
 * @param {HTMLDivElement} riddle The element containing the current riddle
 * @param {Object} program The data for the current riddle for updating
 * @param {number} nextProgramIndex Represents the number of the next program to render
 */
const grantReward = (riddle: HTMLDivElement, program: ProgramT, nextProgramIndex: number) => {
  const input = riddle.querySelector('input') as HTMLInputElement;
  const response = riddle.querySelector('.response') as HTMLDivElement;
  const description = riddle.querySelector('.description') as HTMLDivElement;
  const classicEnding = document.getElementById('classic-ending') as HTMLHeadingElement;

  response.textContent = 'Access Granted.';
  response.classList.remove('fail');
  response.classList.add('success');
  description.textContent = program.description;
  input.value = `✔ ${input.value}`;
  input.disabled = true;
  if (nextProgramIndex < programs.length) {
    renderProgram(nextProgramIndex);
  }
  else {
    classicEnding.classList.remove('dn');
    description.scrollIntoView(options);
  }
}

/**
 * Update the UI to give feedback that the user's answer is incorrect
 * 
 * @param {HTMLDivElement} riddle The element containing the current riddle
 */
const grantPunishment = (riddle: HTMLDivElement) => {
  const response = riddle.querySelector('.response') as HTMLDivElement;

  response.textContent = 'Access Denied.';
  response.classList.add('fail');
  response.classList.remove('success');
  riddle.classList.add('shake');
  setTimeout(() => riddle.classList.remove('shake'), 400);
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
    const riddle = input.closest('.riddle') as HTMLDivElement;
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

  const riddleVisibilityToggleBtn = programClone.querySelector('button') as HTMLButtonElement;
  const riddle = programClone.querySelector('.riddle') as HTMLDivElement;
  const input = programClone.querySelector('input') as HTMLInputElement;

  riddleVisibilityToggleBtn.textContent = programData.id;
  riddleVisibilityToggleBtn.addEventListener('click', () => {
    riddle.classList.toggle('dn');
    riddle.classList.toggle('open');
    if (riddle.classList.contains('open')) {
      input.focus();
    }
  });

  // Bind the keydown event listener with the program index for simpler lookup
  input.addEventListener('keydown', gradeAnswer.bind(null, programIndex));

  const riddleP = programClone.querySelector('.riddle p') as HTMLParagraphElement;

  riddleP.textContent = programData.riddle;

  container.appendChild(programClone);
  // Smoothly scroll to the current riddle to solve
  riddleVisibilityToggleBtn.scrollIntoView(options);
};

// Render the first program once the page has loaded
renderProgram();
