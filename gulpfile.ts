import { src, dest, series } from 'gulp';
import { deleteAsync as del } from 'del';
import jsonMinify from 'gulp-json-minify';
import jsonValidator from 'gulp-json-validator';
import jsonSchema from "gulp-json-schema";
import { Transform } from 'node:stream';
import { Buffer } from 'node:buffer';
import { encode as msgPackEncode } from "@msgpack/msgpack";
import PluginError from 'plugin-error';
import Vinyl from 'vinyl';
import notify from 'gulp-notify';

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
 * @returns {any} The modified file object with updated contents, path, and a `modified` flag.
 */
const convertJsonToMsgPack = (jsonStr: string): string => {
    const programs = JSON.parse(jsonStr);
    const encodedArray = msgPackEncode(programs);
    const encodedString = Array.from(encodedArray).map(byte => byte.toString()).join(' ');

    return encodedString;
};


/**
 * Creates a Transform stream that encodes input files using a custom
 * msgPackBase64Encode function and outputs the encoded data.
 *
 * @function
 * @returns {Transform} A Transform stream operating in object mode.
 *
 */
const msgPack = (): Transform => {
    return new Transform({
        objectMode: true,
        transform(file: Vinyl, encoding, callback) {
            if (file.isStream()) {
                return callback(new PluginError('msgPackEncode', 'Streaming not supported'));
            }

            if (file.isBuffer()) {
                try {
                    const contents = file.contents.toString(encoding);
                    const encodedContents = convertJsonToMsgPack(contents);
                    file.contents = Buffer.from(encodedContents);
                    file.path = file.path.replace('.json', '.txt');
                    file.modified = true;
                    callback(null, file);
                } catch (err) {
                    callback(new PluginError('gulp-msgpack-encode', err as Error));
                }
            }
        }
    });
}

/**
 * Processes JSON files from the source directory by validating,
 * minifying, and transforming them according to a specified schema
 * The processed files are then encoded using MessagePack and saved
 * as .txt files in the destination directory. Any errors encountered
 * in the process are handled with notifications.
 */
function json() {
    return src(`${srcDir}/*.json`)
        .pipe(jsonValidator())
        .pipe(jsonMinify())
        .pipe(jsonSchema("schema.json"))
        .pipe(msgPack())
        .on('error', notify.onError({
            title: '<%= error.plugin %>',
            message: "Error: <%= error.message %>",
        }))
        .pipe(dest(destDir));
}

const encode = series(clean, json);

export { encode as default };