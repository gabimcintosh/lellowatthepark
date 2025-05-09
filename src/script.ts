import { loadPrograms, savePrograms } from "./dataManager";
import { ProgramT, RiddleT } from "./types";
import { ToggleState, DomId, CssSelector, ClassListId } from "./enums";

const programs: ProgramT[] = await loadPrograms();
let loadedProgram: ProgramT | undefined = programs.find(program => program.active) as ProgramT;
const terminal = document.getElementById(DomId.TERMINAL) as HTMLDivElement;
const title = document.getElementById(DomId.TERMINAL_TITLE) as HTMLHeadingElement;
const container = document.getElementById(DomId.PROGRAMS) as HTMLDivElement;
const programTmpl = document.getElementById(DomId.PROGRAM_TMPL) as HTMLTemplateElement;
const programSelectionEl = document.getElementById(DomId.PROGRAM_SELECT) as HTMLDivElement;
const classicEnding = document.getElementById(DomId.CLASSIC_ENDING) as HTMLHeadingElement;
const programSelect = programSelectionEl.querySelector(CssSelector.SELECT) as HTMLSelectElement;

const options: ScrollIntoViewOptions = { behavior: 'smooth' };

/**
 * Update the UI to give feedback that the user's answer is correct
 *
 * @param {HTMLDivElement} riddle The element containing the current riddle
 * @param {RiddleT} programRiddle The data for the current riddle for updating
 * @param {number} nextProgramIndex Represents the number of the next program to render
 */
const grantReward = (riddle: HTMLDivElement, programRiddle: RiddleT, nextProgramIndex: number) => {
    const input = riddle.querySelector(CssSelector.INPUT) as HTMLInputElement;
    const response = riddle.querySelector(CssSelector.RESPONSE) as HTMLDivElement;
    const description = riddle.querySelector(CssSelector.DESCRIPTION) as HTMLParagraphElement;

    response.textContent = 'Access Granted.';
    response.classList.remove(ClassListId.FAIL);
    description.textContent = programRiddle.description;
    input.value = `✔ ${atob(programRiddle.pw)}`;
    input.disabled = true;
    programRiddle.unlocked = true;
    savePrograms(programs);
    if (nextProgramIndex > 0) {
        if (loadedProgram && nextProgramIndex < loadedProgram.riddles.length) {
            const nextRiddle = loadedProgram.riddles[nextProgramIndex] as RiddleT;
            renderProgramRiddle(nextRiddle);
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
 * @param {RiddleT} programRiddle Represents number of the currently rendered program
 * @param {KeyboardEvent} e The keydown event which triggered the check to grade the answer
 */
const gradeAnswer = (programRiddle: RiddleT, e: KeyboardEvent) => {
    if (e.key === 'Enter') {
        const input = e.target as HTMLInputElement;
        const guess = input.value.trim();
        // Find the div containing the current riddle
        const riddle = input.closest(CssSelector.RIDDLE) as HTMLDivElement;
        const decodedAnswer = atob(programRiddle.pw);
        const programRiddleIndex = loadedProgram?.riddles.findIndex(riddle => riddle.id === programRiddle.id) || 0;

        if (guess === decodedAnswer) {
            grantReward(riddle, programRiddle, programRiddleIndex + 1);
        } else {
            grantPunishment(riddle);
        }
    };
}

/**
 * Render a single program onto the page
 *
 * @param {RiddleT} programRiddle Which program to render of the list
 */
const renderProgramRiddle = (programRiddle: RiddleT) => {
    const programClone = programTmpl.content.cloneNode(true) as HTMLElement;

    const riddle = programClone.querySelector(CssSelector.RIDDLE) as HTMLDivElement;
    const riddleDetails = programClone.querySelector(CssSelector.DETAILS) as HTMLDetailsElement;
    const riddleSummary = riddleDetails.querySelector(CssSelector.SUMMARY) as HTMLHeadingElement;
    const input = riddleDetails.querySelector(CssSelector.INPUT) as HTMLInputElement;
    const riddleP = riddleDetails.querySelector(CssSelector.CLUE) as HTMLParagraphElement;

    riddleDetails.open = programRiddle.unlocked;
    riddleDetails.addEventListener('toggle', (e: Event) => {
        const toggleEvent = e as ToggleEvent;
        if (toggleEvent.newState === ToggleState.OPEN) {
            input.focus();
        }
    });

    riddleSummary.textContent = programRiddle.id;

    // Bind the keydown event listener with the program index for simpler lookup
    input.addEventListener('keydown', gradeAnswer.bind(null, programRiddle));

    riddleP.textContent = programRiddle.riddle;

    container.appendChild(programClone);

    if (programRiddle.unlocked) {
        grantReward(riddle, programRiddle, -1);
    }
    else {
        // Smoothly scroll to the current riddle to solve
        riddleDetails.scrollIntoView(options);
    }
};

/**
 * Consecutively render all the programs which are unlocked plus the one which is currently ready to be solved
 */
const renderProgramRiddles = (program: ProgramT) => {
    let riddle: RiddleT;
    let riddleIndex = -1;
    do {
        // Move to the next programIndex and program
        riddle = program.riddles[++riddleIndex];
        renderProgramRiddle(riddle);
    } while (riddle.unlocked && loadedProgram && riddleIndex + 1 < loadedProgram.riddles.length);
};

const resetProgramSelection = (e: Event) => {
    const option = document.createElement('option');
    option.selected = true;
    option.value = 'Select your program';
    option.disabled = true;
    e.target?.removeEventListener('click', resetProgramSelection);
    terminal.classList.add(ClassListId.HIDE);
    programSelectionEl.classList.add(ClassListId.HIDE);
    classicEnding.classList.add(ClassListId.HIDE);
    container.replaceChildren();
    programSelect.replaceChildren(option);
    if (loadedProgram) {
        loadedProgram.riddles.forEach(riddle => riddle.unlocked = false);
        loadedProgram.active = false;
    }
    loadedProgram = undefined;
    savePrograms(programs);
    init();
}

/**
 * Show the classic ending
 */
const theEnd = () => {
    const resetBtn = classicEnding.querySelector(CssSelector.BUTTON) as HTMLButtonElement;
    resetBtn.addEventListener('click', resetProgramSelection);
    classicEnding.classList.remove(ClassListId.HIDE);
    classicEnding.scrollIntoView(options);
}

const programSelectChange = () => {
    programSelect.removeEventListener('change', programSelectChange);
    loadedProgram = programs.find(program => program.name === programSelect.value) as ProgramT;
    loadedProgram.active = true;
    savePrograms(programs);
    programSelectionEl.classList.add(ClassListId.HIDE);
    terminal.classList.remove(ClassListId.HIDE);
    title.textContent = loadedProgram.name;
    renderProgramRiddles(loadedProgram);
}

const renderSelectionScreen = () => {
    programSelect.addEventListener('change', programSelectChange);
    for (const program of programs) {
        const option = document.createElement('option');
        option.value = program.name;
        option.textContent = program.name;
        programSelect.appendChild(option);
    }
    programSelectionEl.classList.remove(ClassListId.HIDE);
    programSelect.focus();
}

const renderProgram = (program: ProgramT) => {
    terminal.classList.remove(ClassListId.HIDE);
    title.textContent = program.name;
    // Render the programs which are unlocked
    renderProgramRiddles(program);
    if (program.riddles[program.riddles.length - 1].unlocked) {
        theEnd();
    }
}

const init = () => {
    if (loadedProgram) {
        renderProgram(loadedProgram)
    }
    else {
        renderSelectionScreen();
    }
}

init();
