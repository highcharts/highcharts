import type { AssertionError } from 'assert';

import { readdirSync, existsSync } from 'fs';
import { join } from 'path';

require('./prepare-data');

const errors = [];
let testCounter: number = 0;

const TEST_PATH = join(__dirname, './tests');


if (existsSync(TEST_PATH)) {
    const testFiles = readdirSync(TEST_PATH)
        .filter(file => file.includes('.test.ts'));

    testFiles.forEach(testFile => {
        const tests = require(join(TEST_PATH, testFile));
        try {
            Object.values(tests).forEach(test => {
                if (typeof test === 'function') {
                    testCounter++;
                    test();
                }
            });
        } catch (error) {
            console.error(report(error));
            errors.push(error.code);
        }
    });
}

if (errors.length) {
    throw new Error(`Failed ${errors.length}/${testCounter} tests`);
}

console.log(`Ran ${testCounter} successful tests`);

function report(error: AssertionError): string {
    const { actual, expected, code, operator, message } = error;

    const printArrayOrString = (array: string | []) => (Array.isArray(array) ? JSON.stringify(array, undefined, 4) : array);

    return `${code} ${message}

Got: ${printArrayOrString(actual)}

Expected: ${printArrayOrString(expected)}
`;
}
