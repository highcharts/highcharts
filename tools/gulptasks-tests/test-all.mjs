import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));

const testFiles = readdirSync(dir)
    .filter(file => file.endsWith('.test.mjs'));

for (const testFile of testFiles) {
    console.log('Testing', testFile);
    await import(join(dir, testFile));
};

