import { src, dest, series } from 'gulp';
import { deleteAsync as del } from 'del';
import jsonMinify from 'gulp-json-minify';
import jsonValidator from 'gulp-json-validator';
import { readFile, writeFile, unlink } from 'fs/promises';
import { Buffer } from 'node:buffer';
import { encode as msgPackEncode } from "@msgpack/msgpack";

const srcDir = 'programs';
const destDir = 'public';

const clean = async () => await del(destDir);

const json = () =>
    src(`${srcDir}/*.json`)
        .pipe(jsonValidator())
        .pipe(jsonMinify())
        .pipe(dest(destDir));

const base64Encode = async () => {
    const programsStr = await readFile(`${destDir}/programs.json`);
    const msgPackBuffer = msgPackEncode(programsStr);
    const base64Buffer = Buffer.from(msgPackBuffer);
    let str = '';
    base64Buffer.forEach((byte) => {
        str += `${byte} `
    });
    str = str.trim();

    await writeFile(`${destDir}/programs.txt`, str);
    await unlink(`${destDir}/programs.json`);
}

const encode = series(clean, json, base64Encode);

export { encode as default };