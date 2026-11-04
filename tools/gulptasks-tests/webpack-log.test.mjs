import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

const sourceURL = new URL('../gulptasks/scripts-webpack.js', import.meta.url);
const utilitiesURL = new URL('../webpacks/utilities.mjs', import.meta.url);
const source = fs.readFileSync(sourceURL, 'utf8');
const require = createRequire(sourceURL);

function loadTask(exec, product = 'Grid') {
    let task;
    runInNewContext(source, {
        process: { env: process.env, stderr: { write() {} } },
        require: name => {
            if (name === 'gulp') {
                return {
                    task(taskName, callback) {
                        task = callback;
                    }
                };
            }
            if (name === 'yargs') {
                return { argv: { product } };
            }
            if (name === '../libs/process') {
                return { exec };
            }
            if (name === '../libs/log') {
                return { message() {}, warn() {}, failure() {}, success() {} };
            }
            return require(name);
        }
    });
    return task;
}

async function withDirectory(check) {
    const root = fs.mkdtempSync(join(tmpdir(), 'hc-webpack-log-'));
    const cwd = process.cwd();
    process.chdir(root);
    try {
        await check(root);
        assert.deepEqual(fs.readdirSync(root).filter(name =>
            name.startsWith('.webpack-log-')), []);
    } finally {
        process.chdir(cwd);
        fs.rmSync(root, { recursive: true, force: true });
    }
}

function childDebug(options, text) {
    execFileSync(process.execPath, ['--input-type=module', '-e',
        `import { debugLog } from ${JSON.stringify(utilitiesURL.href)};` +
        `debugLog(${JSON.stringify(text)});`], { env: options.env });
}

for (const failure of [false, true]) {
    test(`webpack log publication protects substituted paths on ${failure ? 'failure' : 'success'}`, async () => {
        await withDirectory(async root => {
            const sentinel = join(root, 'unrelated.txt');
            fs.writeFileSync(sentinel, 'untouched');
            const error = Object.assign(new Error('compile failed'), {
                stdout: 'captured stdout', stderr: 'captured stderr'
            });
            let calls = 0;
            const task = loadTask(async (command, options) => {
                ++calls;
                if (calls === 1) {
                    fs.symlinkSync(sentinel, 'webpack.log');
                    childDebug(options, 'child diagnostic\n');
                    if (failure) {
                        throw error;
                    }
                    return 'captured stdout';
                }
                assert.match(command, /--bail --stats errors-warnings$/u);
                childDebug(options, 'retry diagnostic\n');
                throw new Error('retry failed');
            });
            if (failure) {
                await assert.rejects(task(), value => value === error);
            } else {
                await task();
            }
            assert.equal(fs.readFileSync(sentinel, 'utf8'), 'untouched');
            assert.equal(fs.readFileSync('webpack.log', 'utf8'), failure ?
                'child diagnostic\nretry diagnostic\ncaptured stdout\ncaptured stderr\n' :
                'child diagnostic\ncaptured stdout');
            assert.equal(fs.lstatSync('webpack.log').isSymbolicLink(), false);
            assert.equal(calls, failure ? 2 : 1);
        });
    });
}

test('webpack resets stale links and preserves two-product output order', async () => {
    for (const link of ['symlink', 'hardlink']) {
        await withDirectory(async root => {
            const sentinel = join(root, 'unrelated.txt');
            fs.writeFileSync(sentinel, 'untouched');
            if (link === 'symlink') {
                fs.symlinkSync(sentinel, 'webpack.log');
            } else {
                fs.linkSync(sentinel, 'webpack.log');
            }
            const commands = [];
            await loadTask(async command => {
                commands.push(command);
                return commands.length === 1 ? 'first\n' : 'second\n';
            }, 'Highcharts')();
            assert.equal(commands.length, 2);
            assert.match(commands[0], /highcharts\.webpack\.mjs/u);
            assert.match(commands[1], /highcharts-es5\.webpack\.mjs/u);
            assert.equal(fs.readFileSync(sentinel, 'utf8'), 'untouched');
            assert.equal(fs.readFileSync('webpack.log', 'utf8'), 'first\nsecond\n');
        });
    }
});

test('concurrent webpack tasks publish complete independent logs', async () => {
    await withDirectory(async () => {
        let release;
        const gate = new Promise(resolve => {
            release = resolve;
        });
        let started;
        const ready = new Promise(resolve => {
            started = resolve;
        });
        const first = loadTask(async () => {
            started();
            await gate;
            return 'first';
        })();
        await ready;
        await loadTask(async () => 'second')();
        assert.equal(fs.readFileSync('webpack.log', 'utf8'), 'second');
        release();
        await first;
        assert.equal(fs.readFileSync('webpack.log', 'utf8'), 'first');
    });
});
