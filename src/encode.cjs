const programsJson = require("./programs.json");
const { encode } = require("@msgpack/msgpack");
const fs = require('node:fs');

const programsStr = JSON.stringify(programsJson);
console.log(programsStr);
const base64Encoded = Buffer.from(programsStr).toString('base64');
console.log(base64Encoded);
const buffer = encode(base64Encoded);

let str = '';
buffer.forEach((byte, index) => {
    str += `${byte} `
});
str = str.trim();

fs.writeFileSync('src/programs.bin', buffer, { encoding: 'binary' });
fs.writeFileSync('src/programs.txt', str, { encoding: 'utf-8' });