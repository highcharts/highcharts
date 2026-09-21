import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { runRelease } from '../grid-release.js';

function fixture(overrides = {}) {
    const events = [];
    return {
        events,
        options: {
            prompt: async message => {
                events.push(message);
                return message.endsWith('[type approve]') ?
                    'approve' : 'done';
            },
            run: (args, cwd) => events.push({ args, cwd }),
            remove: file => events.push({ remove: file }),
            readJSON: () => ({ version: '3.1.0', useMinifiedCode: true }),
            ...overrides
        }
    };
}

test('Dashboards workflow builds dependencies and prepares a local candidate', async () => {
    let configReads = 0;
    const { events, options } = fixture({
        product: 'Dashboards',
        readJSON: file => file.endsWith('config.json') ? {
            compileOnDemand: false,
            useMinifiedCode: configReads++ > 0
        } : { version: '4.2.1' }
    });
    await runRelease(options);
    assert.deepEqual(events.filter(e => e.args).map(e => e.args.join(' ')), [
        'git pull --ff-only',
        'npm i',
        'npm i',
        'npx gulp scripts',
        'npm run gcode',
        'npm run dtest',
        'npx gulp test-cypress --product Dashboards',
        'npm test',
        'npx gulp dist --with-deps',
        'npx gulp dist-release --product Dashboards'
    ]);
    assert.ok(events.some(e => typeof e === 'string' &&
        e.includes('gulptasks/dashboards/build-properties.json')));
    assert.ok(events.some(e => typeof e === 'string' &&
        e.includes('dashboards-dist') && e.includes('manually reset')));
    assert.ok(!events.some(e => typeof e === 'string' &&
        e.includes('grid-lite-dist')));
});

test('Dashboards requires source mode and disabled compile on demand', async () => {
    for (const settings of [
        { compileOnDemand: true, useMinifiedCode: false },
        { compileOnDemand: false, useMinifiedCode: true }
    ]) {
        const { events, options } = fixture({
            product: 'Dashboards', from: 'dry-run', readJSON: () => settings
        });
        await assert.rejects(runRelease(options), /Disable compileOnDemand/u);
        assert.ok(!events.some(e => e.args));
    }
});

test('Dashboards candidate can be skipped for a bugfix', async () => {
    const { events, options } = fixture({
        product: 'Dashboards', from: 'candidate', prompt: async () => 'skip'
    });
    await runRelease(options);
    assert.deepEqual(events, []);
});

test('Dashboards plan has no side effects and CLI help names the product', async () => {
    const unexpected = () => { throw new Error('Unexpected side effect'); };
    await runRelease({
        product: 'Dashboards', plan: true,
        readJSON: unexpected, prompt: unexpected, remove: unexpected,
        run: unexpected
    });
    const result = spawnSync(process.execPath, [
        'tools/dashboards-release.js', '--help'
    ], { encoding: 'utf8' });
    assert.equal(result.status, 0);
    assert.match(result.stdout, /Interactive Dashboards release/u);
    assert.match(result.stdout, /dashboards-dist/u);
});

test('denied reset does not delete files or run commands', async () => {
    const { events, options } = fixture({ prompt: async () => '' });
    await assert.rejects(runRelease(options), /without confirmation/u);
    assert.deepEqual(events, []);
});

test('approval and confirmation prompts have distinct colored labels', async () => {
    const originalTTY = process.stdout.isTTY;
    const originalNoColor = process.env.NO_COLOR;
    try {
        process.stdout.isTTY = true;
        delete process.env.NO_COLOR;
        const { events, options } = fixture();
        await runRelease(options);
        for (const message of events.filter(e => typeof e === 'string')) {
            if (message.endsWith('[type approve]')) {
                assert.ok(message.startsWith(
                    '\u001b[1;33mApproval required:\u001b[0m\n'
                ));
            } else {
                assert.ok(message.startsWith(
                    '\u001b[1;36mConfirmation required:\u001b[0m\n'
                ));
            }
        }
        for (const tty of [false, true]) {
            process.stdout.isTTY = tty;
            process.env.NO_COLOR = '1';
            await assert.rejects(runRelease({
                prompt: async message => {
                    assert.ok(message.startsWith('Approval required:\n'));
                    assert.ok(!message.includes('\u001b'));
                    return 'no';
                }
            }), /without confirmation/u);
            await assert.rejects(runRelease({
                from: 'candidate',
                prompt: async message => {
                    assert.ok(message.startsWith('Confirmation required:\n'));
                    assert.ok(!message.includes('\u001b'));
                    return 'no';
                }
            }), /without confirmation/u);
        }
    } finally {
        process.stdout.isTTY = originalTTY;
        if (typeof originalNoColor === 'undefined') {
            delete process.env.NO_COLOR;
        } else {
            process.env.NO_COLOR = originalNoColor;
        }
    }
});

test('cleanup waits for each removal before proceeding', async () => {
    let finish;
    const removed = [];
    const { events, options } = fixture({
        remove: file => {
            removed.push(file);
            if (removed.length === 1) {
                return new Promise(resolve => { finish = resolve; });
            }
            throw new Error('Stop simulation');
        }
    });
    const pending = runRelease(options);
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(removed.length, 1);
    assert.equal(events.length, 1, 'No next prompt during cleanup');
    finish();
    await assert.rejects(pending, /Stop simulation/u);
});

test('real readline advances after approve and Enter', { timeout: 5000 }, async () => {
    const child = spawn(process.execPath, ['-e', `
        require('./tools/grid-release').runRelease({
            remove: () => {},
            run: () => { throw new Error('Unexpected command'); }
        }).catch(error => {
            console.error(error.message);
            process.exitCode = 1;
        });
    `], { stdio: ['pipe', 'pipe', 'pipe'] });
    try {
        let output = '';
        let approved = false;
        let proceeded = false;
        child.stdout.on('data', chunk => {
            output += chunk;
            if (!approved && output.includes('[type approve]')) {
                approved = true;
                child.stdin.write('approve\n');
            }
            if (!proceeded && output.includes('[type done]')) {
                proceeded = true;
                child.stdin.write('no\n');
            }
        });
        const code = await new Promise((resolve, reject) => {
            child.on('error', reject);
            child.on('close', resolve);
        });
        assert.equal(code, 1);
        assert.ok(proceeded, 'Reached the next manual checkpoint');
    } finally {
        child.kill();
    }
});

test('approved workflow builds before tests and prepares without push', async () => {
    const { events, options } = fixture();
    await runRelease(options);
    assert.deepEqual(events.filter(e => e.remove).map(e =>
        e.remove.split(/[\\/]/u).pop()
    ), ['build', 'code', 'cypress', 'js', 'node_modules', 'out', 'tmp']);
    assert.deepEqual(events.filter(e => e.args).map(e => e.args.join(' ')), [
        'git pull --ff-only',
        'npm i',
        'npm i',
        'npx gulp dist',
        'npx gulp scripts --product Grid',
        'npx gulp scripts --force',
        'npm run gtest',
        'npx gulp dist --product Grid',
        'npx gulp scripts --force',
        'npx gulp compile',
        'npx gulp dist-release --product Grid'
    ]);
    assert.match(events.filter(e => e.args)[2].cwd, /highcharts-utils$/u);
});

test('manual confirmation blocks candidate until answered', async () => {
    let confirm;
    const { events, options } = fixture({
        from: 'candidate',
        prompt: () => new Promise(resolve => { confirm = resolve; })
    });
    const pending = runRelease(options);
    assert.equal(events.length, 0);
    confirm('no');
    await assert.rejects(pending, /without confirmation/u);
    assert.equal(events.length, 0);
});

test('candidate replacement requires separate destructive approval', async () => {
    let count = 0;
    const { events, options } = fixture({
        from: 'candidate',
        prompt: async () => { ++count; return 'done'; }
    });
    await assert.rejects(runRelease(options), /without confirmation/u);
    assert.equal(count, 2);
    assert.equal(events.length, 0);
});

test('command failure stops before subsequent actions', async () => {
    const { events, options } = fixture({
        run: () => { throw new Error('build failed'); },
        from: 'dry-run'
    });
    await assert.rejects(runRelease(options), /build failed/u);
    assert.ok(!events.some(e => typeof e === 'string' &&
        e.startsWith('RELEASE CANDIDATE')));
});

test('source mode prevents demo checks and candidate preparation', async () => {
    const { events, options } = fixture({
        from: 'dry-run',
        readJSON: () => ({ version: '3.1.0', useMinifiedCode: false })
    });
    await assert.rejects(runRelease(options), /must use minified code/u);
    assert.ok(!events.some(e => e.args?.includes('dist-release')));
});

test('plan does not read, prompt, delete or execute', async () => {
    const unexpected = () => { throw new Error('Unexpected side effect'); };
    await runRelease({
        plan: true,
        prompt: unexpected,
        run: unexpected,
        remove: unexpected,
        readJSON: unexpected
    });
});

test('CLI rejects noninteractive execution and push flags', () => {
    for (const args of [
        [], ['--allow-non-master'], ['--push'], ['--from', 'invalid']
    ]) {
        const result = spawnSync(process.execPath, [
            'tools/grid-release.js', ...args
        ], { encoding: 'utf8' });
        assert.equal(result.status, 1);
        assert.match(result.stderr, /interactive terminal|Unknown argument/u);
    }
});

test('non-master override bypasses branch check but still requires approval', () => {
    for (const override of [false, true]) {
        const result = spawnSync(process.execPath, ['-e', `
            process.stdin.isTTY = true;
            process.stdout.isTTY = true;
            const cp = require('node:child_process');
            cp.execFileSync = () => 'debug-branch';
            cp.spawnSync = () => { throw new Error('Unexpected command'); };
            require('node:fs').existsSync = () => true;
            require('./tools/grid-release').main(
                ${JSON.stringify(override ? ['--allow-non-master'] : [])}
            ).catch(error => {
                console.error(error.message);
                process.exitCode = 1;
            });
        `], { input: 'no\n', encoding: 'utf8', timeout: 5000 });
        assert.equal(result.status, 1);
        assert.match(result.stderr, override ?
            /Stopped without confirmation/u : /Run from master/u);
        assert.equal(result.stdout.includes('[type approve]'), override);
    }
});
