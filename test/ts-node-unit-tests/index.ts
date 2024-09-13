import { tap, spec } from 'node:test/reporters';
import { run } from 'node:test';
import { join } from 'node:path';

import * as glob from 'glob';
const files = glob.sync(join(__dirname, 'tests') + '/**/*.test.ts');

// Workaround file for `node --test` not working with Windows and Node 20
// TODO: consider removing when Node 22 is LTS

run({
    files,
    watch: process.argv.includes('--watch')
}).on('test:fail', () => {
    process.exitCode = 1;
}).compose(process.env.CI ? tap : (spec as any)).pipe(process.stdout);
