'use strict';

const {stat} = require('fs').promises;

const fastGlob = require('fast-glob');
const tryToCatch = require('try-to-catch');

const mergeArrays = (a) => [].concat(...a);
const rmDuplicates = (a) => Array.from(new Set(a));
const isJS = (a) => /\.(js|jsx|ts)$/.test(a);
const one = (f) => (a) => f(a);

module.exports = async (args) => {
    return await tryToCatch(getFiles, args);
};

module.exports.isJS = isJS;

async function getFiles(args) {
    const promises = args.map(one(addExt));
    const files = await Promise.all(promises);
    const mergedFiles = mergeArrays(files);
    
    return rmDuplicates(mergeArrays(mergedFiles));
}

async function addExt(a) {
    const [[e], files] = await Promise.all([
        tryToCatch(stat, a),
        fastGlob(a, {
            onlyFiles: false,
        }),
    ]);
    
    if (e && e.code === 'ENOENT' && !files.length)
        return throwNotFound(a);
    
    const jsFiles = [];
    const promises = [];
    for (const file of files) {
        if (isJS(file)) {
            jsFiles.push(file);
            continue;
        }
        
        promises.push(fastGlob(`${file}/**/*.{js,jsx,ts}`));
    }
    
    const promiseResults = !promises.length ? [] : await Promise.all(promises);
    
    const result = [
        ...jsFiles,
        ...mergeArrays(promiseResults),
    ];
    
    return result;
}

function throwNotFound(a) {
    throw Error(`No files matching the pattern "${a}" were found`);
}

