import { deepStrictEqual, strictEqual, match } from 'node:assert';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { after, before, describe, it } from 'node:test';
import { copyFile, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { Worker } from 'node:worker_threads';
import { join, resolve } from 'node:path';
import * as swc from '@swc/core';

type Reply = { result?: number, error?: Error };

const repositoryRoot = resolve(__dirname, '../../../');
const temporaryRoot = join(repositoryRoot, 'tmp');
let fixtureRoot = '';
let workerFile = '';

before(async () => {
    await mkdir(temporaryRoot, { recursive: true });
    fixtureRoot = await mkdtemp(join(temporaryRoot, 'benchmark-worker-'));
    await mkdir(join(fixtureRoot, 'test-data'));
    workerFile = join(fixtureRoot, 'bench-worker.mjs');
    const worker = await swc.transformFile(
        resolve(__dirname, '../bench-worker.ts')
    );
    await writeFile(workerFile, worker.code);
});

after(async () => {
    await rm(fixtureRoot, { recursive: true, force: true });
});

async function fixture(name: string, source: string): Promise<string> {
    const file = join(fixtureRoot, name);
    await writeFile(file, source);
    return file;
}

async function runWorker(testFile: string): Promise<Reply> {
    const worker = new Worker(workerFile, {
        resourceLimits: { stackSizeMb: 20 }
    });
    let timeout: ReturnType<typeof setTimeout>;

    try {
        return await new Promise<Reply>((resolve, reject) => {
            timeout = setTimeout(() => {
                reject(new Error('Benchmark worker did not reply'));
            }, 5000);
            worker.once('message', resolve);
            worker.once('error', reject);
            worker.postMessage({
                testFile,
                size: 7,
                CODE_PATH: repositoryRoot
            });
        });
    } finally {
        clearTimeout(timeout!);
        await worker.terminate();
    }
}

function errorMessage(reply: Reply): string {
    return reply.error instanceof Error ? reply.error.message : String(reply.error);
}

describe('benchmark worker', () => {
    for (const extension of ['ts', 'mts']) {
        it(`runs an ESM .${extension} benchmark with a before hook`, async () => {
            const file = await fixture(`esm #%.${extension}`, `
            export function before(size) {
                return { fileName: 'esm.json', func: () => ({ size }) };
            }
            export default function test({ size, data }) {
                return data?.size === size ? size : -1;
            }
        `);

            strictEqual((await runWorker(file)).result, 7);
        });
    }

    it('runs a CommonJS benchmark export', async () => {
        const file = await fixture('commonjs.cts', `
            module.exports = {
                before: size => ({
                    fileName: 'commonjs.json',
                    func: () => ({ size })
                }),
                default: ({ size, data }) => data?.size === size ? 0 : -1
            };
        `);

        strictEqual((await runWorker(file)).result, 0);
    });

    it('replies when the benchmark has no default function', async () => {
        const file = await fixture('missing-default.mts', 'export const value = 1;');

        match(errorMessage(await runWorker(file)), /must export a default function/);
    });

    it('replies when importing a benchmark throws', async () => {
        const file = await fixture('throws.mts',
            'throw new Error("fixture import failed");');

        match(errorMessage(await runWorker(file)), /fixture import failed/);
    });
});

async function runCLI(name: string, source: string) {
    const root = join(fixtureRoot, name);
    const runner = join(root, 'test/ts-node-unit-tests');
    for (const dir of ['code', 'tools/libs', 'test/ts-node-unit-tests/benchmarks']) {
        await mkdir(join(root, dir), { recursive: true });
    }
    for (const file of ['bench.ts', 'bench-worker.ts']) {
        await copyFile(resolve(__dirname, '..', file), join(runner, file));
    }
    for (const file of ['log.js', 'time.js']) {
        await copyFile(join(repositoryRoot, 'tools/libs', file),
            join(root, 'tools/libs', file));
    }
    await writeFile(join(runner, 'benchmarks/fixture #%.bench.ts'),
        'export const config = { sizes: [1] };\n' + source);

    const result = spawnSync(process.execPath,
        ['--import', 'tsx', join(runner, 'bench.ts')], {
            cwd: root,
            encoding: 'utf8',
            timeout: 10000
        });
    strictEqual(result.error, undefined, result.error?.message);
    return {
        result,
        report: join(root, 'tmp/benchmarks/actual/fixture #%.json')
    };
}

describe('benchmark CLI', () => {
    it('completes all iterations when a benchmark returns zero', async () => {
        const { result, report } = await runCLI('zero',
            'export default () => 0;');

        strictEqual(result.status, 0, result.stderr);
        deepStrictEqual(JSON.parse(readFileSync(report, 'utf8'))[0].results,
            Array(15).fill(0));
    });

    for (const [name, source, error] of [
        ['missing-default', '', /must export a default function/],
        ['throw', 'export default () => { throw new Error("benchmark failed"); };',
            /benchmark failed/],
        ['exit', 'export default () => process.exit(0);',
            /worker exited with code 0 before returning a result/]
    ] as const) {
        it(`fails immediately without a timing report: ${name}`, async () => {
            const { result, report } = await runCLI(name, source);

            strictEqual(result.status, 1, result.stderr);
            match(result.stderr, error);
            strictEqual(existsSync(report), false);
        });
    }

    for (const [index, value] of [
        '0', 'null', 'undefined', 'false', '""'
    ].entries()) {
        it(`rejects a falsy thrown value: ${value}`, async () => {
            const { result, report } = await runCLI(`throw-falsy-${index}`,
                `export default () => { throw ${value}; };`);

            strictEqual(result.status, 1, result.stderr);
            strictEqual(existsSync(report), false);
        });
    }

    for (const [index, value] of [
        'undefined', 'null', '"1"', 'NaN', 'Infinity', '-Infinity'
    ].entries()) {
        it(`rejects an invalid result: ${value}`, async () => {
            const { result, report } = await runCLI(`invalid-result-${index}`,
                `export default () => { return ${value}; };`);

            strictEqual(result.status, 1, result.stderr);
            match(result.stderr, /must return a finite number/);
            strictEqual(existsSync(report), false);
        });
    }
});
