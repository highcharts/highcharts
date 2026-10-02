import { describe, it } from 'node:test';
import { deepStrictEqual } from 'node:assert';
import { readFileSync } from 'node:fs';
import { availableParallelism } from 'node:os';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import { Worker } from 'node:worker_threads';

import * as glob from 'glob';

const ES_MODULES = join(__dirname, '..', '..', '..', 'code', 'es-modules');

/**
 * Type-only modules compile to a bare `export default Name;` and are never
 * imported at runtime.
 */
function isTypeOnly(file: string): boolean {
    return /^export default \w+;$/u.test(
        readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//gu, '').trim()
    );
}

/**
 * Imports a module in a worker, which has its own module graph. Only the
 * modules it imports run before it, the worst order a bundler can produce.
 * Resolves with the error thrown, if any.
 */
function importAlone(file: string): Promise<string|undefined> {
    return new Promise((resolve) => {
        const worker = new Worker(
            `import(${JSON.stringify(pathToFileURL(file).href)})`,
            { eval: true, stderr: true }
        );
        worker.once('error', (e) => resolve(`${e.name}: ${e.message}`));
        worker.once('exit', () => resolve(void 0));
    });
}

describe('ES modules', () => {
    it('should each run before any other module (#25392)', async () => {
        const files = glob
            .sync('**/*.js', {
                absolute: true,
                cwd: ES_MODULES,
                // Masters build on the namespace set up by other masters
                ignore: ['masters/**']
            })
            .filter((file) => !isTypeOnly(file));
        const queue = [...files];
        const failures: Array<string> = [];

        await Promise.all(
            Array.from({ length: availableParallelism() }, async () => {
                for (let file; (file = queue.shift());) {
                    const error = await importAlone(file);

                    if (error) {
                        failures.push(
                            `${relative(ES_MODULES, file)}: ${error}`
                        );
                    }
                }
            })
        );

        deepStrictEqual(
            failures.sort(),
            [],
            'Modules should import what they use at load time, instead of ' +
            'reading it from SeriesRegistry'
        );
    });
});
