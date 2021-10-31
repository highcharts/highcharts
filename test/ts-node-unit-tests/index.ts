import { readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { reportError } from './test-utils';
import {
    starting,
    finished,
    success,
    warn
} from '../../tools/gulptasks/lib/log.js';

const TEST_PATH = join(__dirname, './tests');
const CODE_PATH = join(__dirname, '../../code');

const errors = [];
let testCounter: number = 0;

starting('Unit tests');
// require('./prepare-data');

if (!existsSync(CODE_PATH)) {
    warn('Code has not been compiled. Run npx gulp scripts first');
    process.exit();
}

if (existsSync(TEST_PATH)) {
    const testFiles = readdirSync(TEST_PATH).filter((file) =>
        file.includes('.test.ts')
    );

    testFiles.forEach((testFile) => {
        const tests = require(join(TEST_PATH, testFile));
        Object.values(tests).forEach((test) => {
            try {
                if (typeof test === 'function') {
                    testCounter++;
                    test();
                }
            } catch (error) {
                reportError(error);
                errors.push(error.code);
            }
        });
    });
}

if (errors.length) {
    throw new Error(`Failed ${errors.length}/${testCounter} tests`);
}

success(`Ran ${testCounter} successful tests`);
finished('Unit tests');
