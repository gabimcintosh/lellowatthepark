const fs = require('node:fs');
const buffer = fs.readFileSync('src/programs.bin', { encoding: 'binary' });

const decodedString = Buffer.from(buffer, 'base64').toString('utf-8');
console.log(buffer);
console.log(decodedString);
