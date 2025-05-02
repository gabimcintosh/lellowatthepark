import { src, dest, series } from 'gulp';
import { deleteAsync as del } from 'del';
import jsonMinify from 'gulp-json-minify';
import jsonValidator from 'gulp-json-validator';
import jsonSchema from "gulp-json-schema";
import { Buffer } from 'node:buffer';
import { encode as msgPackEncode } from "@msgpack/msgpack";
import { Transform } from 'node:stream';

const srcDir = 'programs';
const destDir = 'public';

const clean = async () => await del(destDir);


/**
 * Encodes the contents of a JSON file into a space-separated string of byte values
 * using MessagePack encoding, and updates the file's contents and path.
 *
 * @param {Object} file - The file object to process.
 * @param {Buffer} file.contents - The contents of the file as a Buffer.
 * @param {string} file.path - The file path.
 * @returns {Object} The modified file object with updated contents, path, and a `modified` flag.
 */
const encodeObjectToString = (file) => {
    const programsStr = file.contents.toString();
    const programs = JSON.parse(programsStr);
    const encodedArray = msgPackEncode(programs);
    const encodedString = Array.from(encodedArray).map(byte => byte.toString()).join(' ');

    file.contents = Buffer.from(encodedString);
    file.path = file.path.replace(/\.json$/, '.txt');
    file.modified = true;
    return file;
};


/**
 * Creates a Transform stream that encodes input files using a custom
 * msgPackBase64Encode function and outputs the encoded data.
 *
 * @function
 * @returns {Transform} A Transform stream operating in object mode.
 *
 * @example
 * const encodeStream = streamEncode();
 * readableStream.pipe(encodeStream).pipe(writableStream);
 */
const streamEncode = () => {
    const transformStream = new Transform({
        objectMode: true,
        transform: function (file, _, callback) {
            let error = null, output = encodeObjectToString(file);
            callback(error, output);
        }
    });

    return transformStream;
}

const json = () =>
    src(`${srcDir}/*.json`)
        .pipe(jsonValidator())
        .pipe(jsonMinify())
        .pipe(jsonSchema("schema.json"))
        .pipe(streamEncode())
        .pipe(dest(destDir));

const encode = series(clean, json);

export { encode as default };