
const programs = [
  { id: "Program 01", pw: "Rocket", msg: "I got us in the virtual queue for Guardians! Sit back, relax, get some rest on this flight and let's start our vacation on your favorite ride." },
  { id: "Program 02", pw: "BurningRome", msg: "Now that Johnny has lowered the height requirement, let's go relax on Spaceship Earth." },
  { id: "Program 03", pw: "Soren", msg: "\"ha...\", time to ride Soarin' :)" },
  { id: "Program 04", pw: "EdibleSushi", msg: "I saw this on the Epcot Festival menu and thought you'd love it. Let's get some Frushi in Japan!" },
  { id: "Program 05", pw: "GirlDinner", msg: "Now that we've had Girl Dinner, let's go have lunch at Spice Road Table." },
  { id: "Program 06", pw: "TeefsAndRocket", msg: "Surprise! It's another Guardians ride! Let's hope we get a cool song." },
  { id: "Program 07", pw: "KendrickDisneyRemix", msg: "While Epcot is great, I have more magical things I want to do with only you. Let's get on the Skyliner to Hollywood Studios for our next plan." },
  { id: "Program 08", pw: "R2Excited", msg: "Now that we're here... Surprise! I booked you a Droid Depot reservation to build your own Droid." },
  { id: "Program 09", pw: "IWillBePilot", msg: "Okay, now you will be pilot. Let's go to Smugglers Run! We're starting off your Droid with habits of theft." },
  { id: "Program 10", pw: "HeWillBePilot", msg: "Now that you've been Pilot, let's have C-3PO cruise us around in Star Tours!" },
  { id: "Program 11", pw: "NotSpicyChicken", msg: "Now that we've hit up a few rides, gotten a little amigo to bring home, let's relax and have some dinner at Docking Bay 7." },
  { id: "Program 12", pw: "ILoveYou", msg: "Thank you for letting me plan a special day for you at Disney World. Let's spend the rest of the evening doing anything you want. I love you!\n\nPS, I booked us for Liberty Tree Tavern one day, so we can get a break from everything and relax. Just the two of us. Thank you for showing me that vacations don't have to be stressful." }
];

const masterPassword = "SurpriseDisneyDay25";
let unlocked = [];

window.addEventListener("DOMContentLoaded", () => {
  const output = document.getElementById("output");
  const input = document.getElementById("input");
  const button = document.getElementById("submit");

  function updateOutput() {
    output.innerText = "";
    programs.forEach((prog, i) => {
      const isUnlocked = unlocked.includes(i);
      output.innerText += `${prog.id} > ${isUnlocked ? prog.msg : "LOCKED"}\n\n`;
    });
    output.innerText += "Enter password:";
  }

  function processPassword(val) {
    if (val === masterPassword) {
      output.innerText = "== MASTER PASSWORD ACCEPTED ==\n\n";
      programs.forEach((prog) => {
        output.innerText += `${prog.id}: "${prog.pw}"\n`;
      });
    } else {
      let matched = false;
      programs.forEach((prog, i) => {
        if (val === prog.pw) {
          if (!unlocked.includes(i)) unlocked.push(i);
          matched = true;
        }
      });
      if (!matched) {
        output.innerText += "\nInvalid password. Try again.\n";
      }
      updateOutput();
    }
  }

  button.addEventListener("click", () => {
    processPassword(input.value.trim());
    input.value = "";
  });

  input.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      processPassword(input.value.trim());
      input.value = "";
    }
  });

  updateOutput();
});
