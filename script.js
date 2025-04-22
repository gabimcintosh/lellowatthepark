const programs = [
  { id: "Program 01", pw: "Um9ja2V0", riddle: `One of our favorite movie series, with the saddest story arc. Who is my favorite character? Hint: He is a trash panda.`, unlocked: false },
  { id: "Program 02", pw: "QnVybmluZ1JvbWU=", riddle: `This one is a vine reference, think of a keen smell. We even got a candle for this one. Hint is What happened to the Library of Alexandria?`, unlocked: false },
  { id: "Program 03", pw: "U29yZW4=", riddle: `Our bonus nephews name, this ride should be considered his!`, unlocked: false },
  { id: "Program 04", pw: "RWRpYmxlU3VzaGk=", riddle: `You're slowly getting me into fish, but still not sushi... this one is in the Japan pavilion, it's a Gabi-coded snack. What's it called?`, unlocked: false },
  { id: "Program 05", pw: "R2lybERpbm5lcg==", riddle: `You always call my food this when it has no protein :)`, unlocked: false },
  { id: "Program 06", pw: "VGVlZnNBbmRSb2NrZXQ=", riddle: `From the latest Guardians movie, who was Rocket's best friend?`, unlocked: false },
  { id: "Program 07", pw: "S2VuZHJpY2tEaXNuZXlSZW1peA==", riddle: `Not sure if you've seen the trend on TikTok for the Kendrick Disney Remix, "We can take the tram or we can take the SKYLINERRRR!!"`, unlocked: false },
  { id: "Program 08", pw: "UjJFeGNpdGVk", riddle: `This is something you've mentioned in passing, this has been the hardest secret to keep. Our R Droid will be excited for a friend.`, unlocked: false },
  { id: "Program 09", pw: "SVdpbGxCZVBpbG90", riddle: `You always make this reference when we get on a plane!`, unlocked: false },
  { id: "Program 10", pw: "SGVXaWxsQmVQaWxvdA==", riddle: `Now that you have a little friend who wants to fly, who will be pilot?`, unlocked: false },
  { id: "Program 11", pw: "Tm90U3BpY3lDaGlja2Vu", riddle: `Now it's time for a yummy dinner that we always look forward to, we usually order the same thing, but it's never as spicy as it claims.`, unlocked: false },
  { id: "Program 12", pw: "SUxvdmVZb3U=", riddle: `What usually comes after, "Sorry - _ ____ ___".`, unlocked: false },
];


const container = document.getElementById("programs");

programs.forEach((prog, i) => {
  const div = document.createElement("div");
  div.className = "program";

  const btn = document.createElement("button");
  btn.textContent = prog.id;
  btn.onclick = () => {
    riddleDiv.style.display = riddleDiv.style.display === "none" ? "block" : "none";
  };

  const riddleDiv = document.createElement("div");
  riddleDiv.className = "riddle";
  riddleDiv.innerHTML = `
    <p>${prog.riddle}</p>
    <input type="text" placeholder="Enter password..." />
    <div class="response" style="margin-top:5px;"></div>
  `;

  const input = riddleDiv.querySelector("input");
  const response = riddleDiv.querySelector(".response");

  input.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      const guess = input.value.trim();
      const decoded = atob(prog.pw);
      if (guess === decoded) {
        prog.unlocked = true;
        response.textContent = "Access Granted.";
        response.style.color = "#33ff33";
      } else {
        response.textContent = "Access Denied.";
        response.style.color = "#ff3333";
        riddleDiv.classList.add("shake");
        setTimeout(() => riddleDiv.classList.remove("shake"), 400);
      }
    }
  });

  div.appendChild(btn);
  div.appendChild(riddleDiv);
  container.appendChild(div);
});
