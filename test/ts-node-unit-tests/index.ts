import type { AssertionError } from 'assert';

import { readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { starting, finished, failure, success } from '../../tools/gulptasks/lib/log.js';


const TEST_PATH = join(__dirname, './tests');

const errors = [];
let testCounter: number = 0;

starting('Unit tests')
// require('./prepare-data');

if (existsSync(TEST_PATH)) {
    const testFiles = readdirSync(TEST_PATH)
        .filter(file => file.includes('.test.ts'));

    testFiles.forEach(testFile => {
        const tests = require(join(TEST_PATH, testFile));
        Object.values(tests).forEach(test => {
            try {
                if (typeof test === 'function') {
                    testCounter++;
                    test();
                }
            } catch (error) {
                failure(report(error));
                errors.push(error.code);
            }
        });
    });
}

if (errors.length) {
    throw new Error(`Failed ${errors.length}/${testCounter} tests`);
}

success(`Ran ${ testCounter } successful tests`)
finished('Unit tests');

function report(error: AssertionError): string {
    const { actual, expected, code, operator, message } = error;

    const printArrayOrString = (array: string | []) => (Array.isArray(array) ? JSON.stringify(array, undefined, 4) : array);

    return `${code} ${message}

Got: ${printArrayOrString(actual)}

Expected: ${printArrayOrString(expected)}
`;
}