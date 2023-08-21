import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { reportError } from './test-utils';
import { starting, finished, success, warn } from '../../tools/gulptasks/lib/log.js';

const BENCH_PATH = join(__dirname, './benchmarks');
const CODE_PATH = join(__dirname, '../../code');

const errors = [];
let testCounter: number = 0;

starting('Benchmarks');

if (!existsSync(CODE_PATH)) {
    warn('Code has not been compiled. Run npx gulp scripts first');
    process.exit();
}

if (existsSync(BENCH_PATH)) {
    const testFiles = readdirSync(BENCH_PATH)
        .filter(file => file.includes('.bench.ts'));

    testFiles.forEach(testFile => {
        const tests = require(join(BENCH_PATH, testFile));
        Object.values(tests).forEach(test => {
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

success(`Ran ${testCounter} successful benches`);
finished('Benchmarks');
