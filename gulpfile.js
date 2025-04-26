import { src, dest, series } from 'gulp';
import { deleteAsync as del } from 'del';
import jsonMinify from 'gulp-json-minify';

const srcDir = 'programs';
const destDir = 'public';

const encode = series(clean, json);

async function clean() {
    await del(destDir);
}

function json() {
    return src(`${srcDir}/*.json`)
        .pipe(jsonMinify())
        .pipe(dest(destDir));
}

export { encode as default };