const programs = [
  { id: "Program 01", pw: "Um9ja2V0", riddle: `One of our favorite movie series, with the saddest story arc. Who is my favorite character? Hint: He is a trash panda.`, description: `We’re starting the trip off with your favorite ride: Guardians of the Galaxy!`, unlocked: false },
  { id: "Program 02", pw: "QnVybmluZ1JvbWU=", riddle: `This one is a vine reference, think of a keen smell. We even got a candle for this one. Hint is What happened to the Library of Alexandria?`, description: `Now that Johnny has lowered the height requirement, let’s relax on Spaceship Earth.`, unlocked: false },
  { id: "Program 03", pw: "U29yZW4=", riddle: `Our bonus nephews name, this ride should be considered his!`, description: `Time to ride Soarin’ — just for our bonus nephew!`, unlocked: false },
  { id: "Program 04", pw: "RWRpYmxlU3VzaGk=", riddle: `You're slowly getting me into fish, but still not sushi... this one is in the Japan pavilion, it's a Gabi-coded snack. What's it called?`, description: `Let’s head to Japan for a Gabi-coded snack: frushi!`, unlocked: false },
  { id: "Program 05", pw: "R2lybERpbm5lcg==", riddle: `You always call my food this when it has no protein :)`, description: `You always call it Girl Dinner when there’s no protein — let’s eat!`, unlocked: false },
  { id: "Program 06", pw: "VGVlZnNBbmRSb2NrZXQ=", riddle: `From the latest Guardians movie, who was Rocket's best friend?`, description: `Let’s go ride Guardians again! Fingers crossed for a new song.`, unlocked: false },
  { id: "Program 07", pw: "S2VuZHJpY2tEaXNuZXlSZW1peA==", riddle: `Not sure if you've seen the trend on TikTok for the Kendrick Disney Remix, "We can take the tram or we can take the SKYLINERRRR!!"`, description: `It’s time to park hop — let’s take the Skyliner to Hollywood Studios!`, unlocked: false },
  { id: "Program 08", pw: "UjJFeGNpdGVk", riddle: `This is something you've mentioned in passing, this has been the hardest secret to keep. Our R Droid will be excited for a friend.`, description: `I booked Droid Depot. Let’s build our very own R-unit!`, unlocked: false },
  { id: "Program 09", pw: "SVdpbGxCZVBpbG90", riddle: `You always make this reference when we get on a plane!`, description: `Smugglers Run next — and YOU will be the pilot.`, unlocked: false },
  { id: "Program 10", pw: "SGVXaWxsQmVQaWxvdA==", riddle: `Now that you have a little friend who wants to fly, who will be pilot?`, description: `Now it’s C-3PO’s turn to fly us in Star Tours!`, unlocked: false },
  { id: "Program 11", pw: "Tm90U3BpY3lDaGlja2Vu", riddle: `Now it's time for a yummy dinner that we always look forward to, we usually order the same thing, but it's never as spicy as it claims.`, description: `Dinner time: Docking Bay 7, our go-to not-spicy spicy chicken!`, unlocked: false },
  { id: "Program 12", pw: "SUxvdmVZb3U=", riddle: `What usually comes after, "Sorry - _ ____ ___".`, description: `Let’s wind down. Thank you for letting me plan this special day. I love you!`, unlocked: false },
];

const container = document.getElementById("programs");
const programTmpl = document.querySelector("#program-tmpl");

/**
 * Update the UI to give feedback that the user's answer is correct
 * 
 * @param {HTMLDivElement} riddle The element containing the current riddle
 * @param {Object} program The data for the current riddle for updating
 * @param {number} nextProgramIndex Represents the number of the next program to render
 */
const grantReward = (riddle, program, nextProgramIndex) => {
  const input = riddle.querySelector('input');
  const response = riddle.querySelector('.response');
  const description = riddle.querySelector('.description');

  response.textContent = "Access Granted.";
  response.classList.remove('fail');
  response.classList.add('success');
  description.textContent = program.description;
  input.disabled = true;
  if (nextProgramIndex < programs.length) {
    renderProgram(nextProgramIndex);
  }
}

/**
 * Update the UI to give feedback that the user's answer is incorrect
 * 
 * @param {HTMLDivElement} riddle The element containing the current riddle
 */
const grantPunishment = (riddle) => {
  const response = riddle.querySelector('.response');

  response.textContent = "Access Denied.";
  response.classList.add('fail');
  response.classList.remove('success');
  riddle.classList.add("shake");
  setTimeout(() => riddle.classList.remove("shake"), 400);
};

/**
 * Verify if the user has answered the riddle correctly
 * 
 * @param {number} programIndex Represents number of the currently rendered program
 * @param {KeyboardEvent} e The keydown event which triggered the check to grade the answer
 */
const gradeAnswer = (programIndex, e) => {
  if (e.key === "Enter") {
    const input = e.target;
    const program = programs[programIndex];
    const guess = input.value.trim();
    // Find the div containing the current riddle
    const riddle = input.closest('.riddle');
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
const renderProgram = (programIndex) => {
  const programData = programs[programIndex]
  const programClone = programTmpl.content.cloneNode(true);

  const riddleVisibilityToggleBtn = programClone.querySelector('button');
  const riddle = programClone.querySelector('.riddle');
  const input = programClone.querySelector('input');

  riddleVisibilityToggleBtn.textContent = programData.id;
  riddleVisibilityToggleBtn.addEventListener('click', () => {
    riddle.classList.toggle('closed');
    riddle.classList.toggle('open');
    if (riddle.classList.contains('open')) {
      input.focus();
    }
  });

  // Bind the keydown event listener with the program index for simpler lookup
  input.addEventListener('keydown', gradeAnswer.bind(null, programIndex));

  programClone.querySelector('.riddle p').textContent = programData.riddle;

  container.appendChild(programClone);
  // Smoothly scroll to the current riddle to solve
  riddleVisibilityToggleBtn.scrollIntoView({ behavior: "smooth" })
};

// Render the first program once the page has loaded
renderProgram(0);
