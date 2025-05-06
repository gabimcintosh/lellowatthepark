import { loadPrograms, savePrograms } from "./dataManager";
import { ProgramT } from "./types";
import { ToggleState, DomId, CssSelector, ClassListId } from "./enums";

const programs: ProgramT[] = await loadPrograms();
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
const grantReward = (riddle: HTMLDivElement, program: ProgramT, nextProgramIndex: number | undefined) => {
    const input = riddle.querySelector(CssSelector.INPUT) as HTMLInputElement;
    const response = riddle.querySelector(CssSelector.RESPONSE) as HTMLDivElement;
    const description = riddle.querySelector(CssSelector.DESCRIPTION) as HTMLParagraphElement;

    response.textContent = 'Access Granted.';
    response.classList.remove(ClassListId.FAIL);
    description.textContent = program.description;
    input.value = `✔ ${atob(program.pw)}`;
    input.disabled = true;
    program.unlocked = true;
    savePrograms(programs);
    if (nextProgramIndex) {
        if (nextProgramIndex < programs.length) {
            renderProgram(nextProgramIndex);
        }
        else {
            theEnd();
        }
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

    const riddle = programClone.querySelector(CssSelector.RIDDLE) as HTMLDivElement;
    const riddleDetails = programClone.querySelector(CssSelector.DETAILS) as HTMLDetailsElement;
    const riddleSummary = riddleDetails.querySelector(CssSelector.SUMMARY) as HTMLHeadingElement;
    const input = riddleDetails.querySelector(CssSelector.INPUT) as HTMLInputElement;
    const riddleP = riddleDetails.querySelector(CssSelector.CLUE) as HTMLParagraphElement;

    riddleDetails.open = programData.unlocked;
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

    if (programData.unlocked) {
        grantReward(riddle, programData, undefined);
    }
    else {
        // Smoothly scroll to the current riddle to solve
        riddleDetails.scrollIntoView(options);
    }
};

/**
 * Consecutively render all the programs which are unlocked plus the one which is currently ready to be solved
 */
const renderPrograms = () => {
    let program;
    let programIndex = -1;
    do {
        // Move to the next programIndex and program
        program = programs[++programIndex];
        renderProgram(programIndex);
    } while (program.unlocked && programIndex + 1 < programs.length);
};

/**
 * Show the classic ending
 */
const theEnd = () => {
    const classicEnding = document.getElementById(DomId.CLASSIC_ENDING) as HTMLHeadingElement;
    classicEnding.classList.remove(ClassListId.HIDE);
    classicEnding.scrollIntoView(options);
}


// Render the programs which are unlocked
renderPrograms();
if (programs[programs.length - 1].unlocked) {
    theEnd();
}
