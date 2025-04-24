const fs = require('node:fs');
const { Buffer } = require('node:buffer');
const { encode } = require("@msgpack/msgpack");
const programsJson = require("../src/programs.json");

const programsStr = JSON.stringify(programsJson);
const base64Encoded = Buffer.from(programsStr).toString('base64');
const buffer = encode(base64Encoded);

let str = '';
buffer.forEach((byte) => {
    str += `${byte} `
});
str = str.trim();

fs.mkdirSync('public');

fs.writeFileSync('public/programs.txt', str, { encoding: 'utf-8' });