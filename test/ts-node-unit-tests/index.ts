import { execSync } from 'child_process';
import path from 'path';

// Can also use gulp for this
execSync(`npx ts-node ${path.join(__dirname, 'prepare-data.ts')}`);

// ToDo: walk the test folder and run everything in it
const test = execSync(`npx ts-node ${path.join(__dirname, 'tests/series/maps-series-test.ts')}`)
console.log(test.toString());
