
// Decode the base64-encoded program list
const decodedPrograms = atob("CmNvbnN0IHByb2dyYW1zID0gWwogIHsgaWQ6ICJQcm9ncmFtIDAxIiwgcHc6ICJSb2NrZXQiLCBtc2c6ICJJIGdvdCB1cyBpbiB0aGUgdmlydHVhbCBxdWV1ZSBmb3IgR3VhcmRpYW5zISBTaXQgYmFjaywgcmVsYXgsIGdldCBzb21lIHJlc3Qgb24gdGhpcyBmbGlnaHQgYW5kIGxldCdzIHN0YXJ0IG91ciB2YWNhdGlvbiBvbiB5b3VyIGZhdm9yaXRlIHJpZGUuIiB9LAogIHsgaWQ6ICJQcm9ncmFtIDAyIiwgcHc6ICJCdXJuaW5nUm9tZSIsIG1zZzogIk5vdyB0aGF0IEpvaG5ueSBoYXMgbG93ZXJlZCB0aGUgaGVpZ2h0IHJlcXVpcmVtZW50LCBsZXQncyBnbyByZWxheCBvbiBTcGFjZXNoaXAgRWFydGguIiB9LAogIHsgaWQ6ICJQcm9ncmFtIDAzIiwgcHc6ICJTb3JlbiIsIG1zZzogIlwiaGEuLi5cIiwgdGltZSB0byByaWRlIFNvYXJpbicgOikiIH0sCiAgeyBpZDogIlByb2dyYW0gMDQiLCBwdzogIkVkaWJsZVN1c2hpIiwgbXNnOiAiSSBzYXcgdGhpcyBvbiB0aGUgRXBjb3QgRmVzdGl2YWwgbWVudSBhbmQgdGhvdWdodCB5b3UnZCBsb3ZlIGl0LiBMZXQncyBnZXQgc29tZSBGcnVzaGkgaW4gSmFwYW4hIiB9LAogIHsgaWQ6ICJQcm9ncmFtIDA1IiwgcHc6ICJHaXJsRGlubmVyIiwgbXNnOiAiTm93IHRoYXQgd2UndmUgaGFkIEdpcmwgRGlubmVyLCBsZXQncyBnbyBoYXZlIGx1bmNoIGF0IFNwaWNlIFJvYWQgVGFibGUuIiB9LAogIHsgaWQ6ICJQcm9ncmFtIDA2IiwgcHc6ICJUZWVmc0FuZFJvY2tldCIsIG1zZzogIlN1cnByaXNlISBJdCdzIGFub3RoZXIgR3VhcmRpYW5zIHJpZGUhIExldCdzIGhvcGUgd2UgZ2V0IGEgY29vbCBzb25nLiIgfSwKICB7IGlkOiAiUHJvZ3JhbSAwNyIsIHB3OiAiS2VuZHJpY2tEaXNuZXlSZW1peCIsIG1zZzogIldoaWxlIEVwY290IGlzIGdyZWF0LCBJIGhhdmUgbW9yZSBtYWdpY2FsIHRoaW5ncyBJIHdhbnQgdG8gZG8gd2l0aCBvbmx5IHlvdS4gTGV0J3MgZ2V0IG9uIHRoZSBTa3lsaW5lciB0byBIb2xseXdvb2QgU3R1ZGlvcyBmb3Igb3VyIG5leHQgcGxhbi4iIH0sCiAgeyBpZDogIlByb2dyYW0gMDgiLCBwdzogIlIyRXhjaXRlZCIsIG1zZzogIk5vdyB0aGF0IHdlJ3JlIGhlcmUuLi4gU3VycHJpc2UhIEkgYm9va2VkIHlvdSBhIERyb2lkIERlcG90IHJlc2VydmF0aW9uIHRvIGJ1aWxkIHlvdXIgb3duIERyb2lkLiIgfSwKICB7IGlkOiAiUHJvZ3JhbSAwOSIsIHB3OiAiSVdpbGxCZVBpbG90IiwgbXNnOiAiT2theSwgbm93IHlvdSB3aWxsIGJlIHBpbG90LiBMZXQncyBnbyB0byBTbXVnZ2xlcnMgUnVuISBXZSdyZSBzdGFydGluZyBvZmYgeW91ciBEcm9pZCB3aXRoIGhhYml0cyBvZiB0aGVmdC4iIH0sCiAgeyBpZDogIlByb2dyYW0gMTAiLCBwdzogIkhlV2lsbEJlUGlsb3QiLCBtc2c6ICJOb3cgdGhhdCB5b3UndmUgYmVlbiBQaWxvdCwgbGV0J3MgaGF2ZSBDLTNQTyBjcnVpc2UgdXMgYXJvdW5kIGluIFN0YXIgVG91cnMhIiB9LAogIHsgaWQ6ICJQcm9ncmFtIDExIiwgcHc6ICJOb3RTcGljeUNoaWNrZW4iLCBtc2c6ICJOb3cgdGhhdCB3ZSd2ZSBoaXQgdXAgYSBmZXcgcmlkZXMsIGdvdHRlbiBhIGxpdHRsZSBhbWlnbyB0byBicmluZyBob21lLCBsZXQncyByZWxheCBhbmQgaGF2ZSBzb21lIGRpbm5lciBhdCBEb2NraW5nIEJheSA3LiIgfSwKICB7IGlkOiAiUHJvZ3JhbSAxMiIsIHB3OiAiSUxvdmVZb3UiLCBtc2c6ICJUaGFuayB5b3UgZm9yIGxldHRpbmcgbWUgcGxhbiBhIHNwZWNpYWwgZGF5IGZvciB5b3UgYXQgRGlzbmV5IFdvcmxkLiBMZXQncyBzcGVuZCB0aGUgcmVzdCBvZiB0aGUgZXZlbmluZyBkb2luZyBhbnl0aGluZyB5b3Ugd2FudC4gSSBsb3ZlIHlvdSFcblxuUFMsIEkgYm9va2VkIHVzIGZvciBMaWJlcnR5IFRyZWUgVGF2ZXJuIG9uZSBkYXksIHNvIHdlIGNhbiBnZXQgYSBicmVhayBmcm9tIGV2ZXJ5dGhpbmcgYW5kIHJlbGF4LiBKdXN0IHRoZSB0d28gb2YgdXMuIFRoYW5rIHlvdSBmb3Igc2hvd2luZyBtZSB0aGF0IHZhY2F0aW9ucyBkb24ndCBoYXZlIHRvIGJlIHN0cmVzc2Z1bC4iIH0KXTsK");
eval(decodedPrograms); // Defines 'programs'

// Decode master password
const masterPassword = atob("U3VycHJpc2VEaXNuZXlEYXkyNQ==");
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
