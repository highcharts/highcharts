import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

const sourceURL = new URL('../libs/process.js', import.meta.url);
const require = createRequire(sourceURL);

function loadProcess() {
    const output = [],
        messages = [];
    const module = { exports: {} };
    runInNewContext(fs.readFileSync(sourceURL, 'utf8'), {
        module,
        __dirname: dirname(fileURLToPath(sourceURL)),
        process: { cwd: process.cwd, stdout: { write: text => output.push(text) } },
        require: name => (name === './log' ? {
            failure: error => messages.push(error),
            success: (...args) => messages.push(args)
        } : require(name))
    });
    return { lib: module.exports, output, messages };
}

test('execFile preserves literal arguments even when shell:true is requested', async () => {
    const { lib } = loadProcess();
    const args = ['space in path', '$(printf substituted)', '`printf substituted`',
        'value; echo injected', 'quote" and apostrophe\''];
    const stdout = await lib.execFile(process.execPath, [
        '-e', 'process.stdout.write(JSON.stringify(process.argv.slice(1)))', ...args
    ], { silent: 2, shell: true });
    assert.deepEqual(JSON.parse(stdout), args);
});

test('execFile preserves stdout, silent modes and process errors', async () => {
    for (const silent of [0, 1, 2]) {
        const { lib, output, messages } = loadProcess();
        assert.equal(await lib.execFile(process.execPath,
            ['-e', 'process.stdout.write("ordinary output")'], { silent }),
        'ordinary output');
        assert.equal(output.join(''), silent ? '' : 'ordinary output');
        assert.equal(messages.length, silent === 2 ? 0 : 1);
        await assert.rejects(lib.execFile(process.execPath,
            ['-e', 'process.exitCode = 7'], { silent }), { code: 7 });
        assert.equal(messages.at(-1).code, 7);
    }
    const { lib, messages } = loadProcess();
    await assert.rejects(lib.execFile('not-a-real-highcharts-executable', [],
        { silent: 2 }), { code: 'ENOENT' });
    assert.equal(messages[0].code, 'ENOENT');
});

test('exec retains existing shell execution semantics', async () => {
    const { lib } = loadProcess();
    assert.equal((await lib.exec('echo first && echo second', { silent: 2 }))
        .trim().replace(/\r/gu, ''), 'first\nsecond');
});

function loadCypress(argv, calls) {
    const url = new URL('../gulptasks/test-cypress.js', import.meta.url);
    const taskRequire = createRequire(url);
    let task;
    function mockedRequire(name) {
        if (name === 'gulp') {
            return {
                task(taskName, callback) {
                    task = callback;
                }
            };
        }
        if (name === 'yargs') {
            return { argv };
        }
        if (name === '../libs/process') {
            return {
                async exec(command) {
                    calls.push(command);
                },
                async execFile(file, args) {
                    calls.push([file, ...args]);
                }
            };
        }
        if (name === '../libs/log') {
            return { success() {} };
        }
        return taskRequire(name);
    }
    mockedRequire.resolve = taskRequire.resolve;
    runInNewContext(fs.readFileSync(url, 'utf8'), {
        process, require: mockedRequire
    });
    return task;
}

test('Cypress passes literal config paths and preserves prerequisite ordering', async () => {
    const url = new URL('../gulptasks/test-cypress.js', import.meta.url);
    const taskRequire = createRequire(url);
    const cypress = join(dirname(taskRequire.resolve('cypress/package.json')), 'bin', 'cypress');
    for (const argv of [{}, { product: 'grid' },
        { product: 'grid; echo injected #', demos: true },
        { product: 'dashboards' }, { product: 'dashboards-grid', demos: true }]) {
        const calls = [];
        const task = loadCypress(argv, calls);
        await task();
        const expected = [];
        if (argv.product?.startsWith('dashboards')) {
            expected.push('npx gulp scripts --product Dashboards',
                'npx gulp scripts --product Grid');
        }
        if (argv.product) {
            expected.push([process.execPath, cypress, 'run', '--config-file',
                join('test', 'cypress', argv.product,
                    argv.demos ? 'demos.config.mjs' : 'config.mjs')]);
        }
        assert.deepEqual(calls, expected);
    }
});
