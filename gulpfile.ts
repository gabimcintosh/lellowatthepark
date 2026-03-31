import { src, dest, series } from 'gulp';
import { deleteAsync as del } from 'del';
import jsonMinify from 'gulp-json-minify';
import jsonValidator from 'gulp-json-validator';
import jsonSchema from 'gulp-json-schema';
import { Buffer } from 'node:buffer';
import { Transform } from 'node:stream';
import { encode as msgPackEncode } from '@msgpack/msgpack';
import PluginError from 'plugin-error';
import Vinyl from 'vinyl';
import notify from 'gulp-notify';
import concat from 'gulp-json-concat';

import type { AppSaveDataT, ProgramT } from './src/types';

const srcDir = 'programs';
const destDir = 'public';

const clean = async () => await del(destDir);


/**
 * Parses a JSON string, encodes it using MessagePack, and returns
 * the result as a space-separated string of byte values.
 *
 * @param jsonStr - A valid JSON string to encode
 * @returns The MessagePack-encoded data as a space-separated byte string
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
        transform(file: Vinyl, _encoding, callback) {
            if (file.isStream()) {
                return callback(new PluginError('msgPackEncode', 'Streaming not supported'));
            }

            if (file.isBuffer()) {
                try {
                    const contents = file.contents.toString('utf8');
                    const encodedContents = convertJsonToMsgPack(contents);
                    file.contents = Buffer.from(encodedContents);
                    file.path = file.path.replace('.json', '.txt');
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
    const stream = src(`${srcDir}/*.json`)
        .pipe(jsonValidator())
        .pipe(jsonMinify())
        .pipe(jsonSchema('schema.json'))
        .pipe(concat('programs.json', (data: AppSaveDataT) => {
            const programs: ProgramT[] = Object.values(data);
            return Buffer.from(JSON.stringify(programs))
        }))
        .pipe(msgPack())
        .pipe(dest(destDir));

    stream.on('error', notify.onError({
        title: '<%= error.plugin %>',
        message: 'Error: <%= error.message %>',
    }));

    return stream;
}

const encode = series(clean, json);

export { encode as default };
