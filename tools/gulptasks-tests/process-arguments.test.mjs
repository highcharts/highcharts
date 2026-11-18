import assert from 'node:assert/strict';
import test from 'node:test';
import ProcessLib from '../libs/process.js';

test('execFile preserves literal arguments even when shell:true is requested', async () => {
    const args = ['space in path', '$(printf substituted)', '`printf substituted`',
        'value; echo injected', 'quote" and apostrophe\''];
    const stdout = await ProcessLib.execFile(process.execPath, [
        '-e', 'process.stdout.write(JSON.stringify(process.argv.slice(1)))', ...args
    ], { silent: 2, shell: true });
    assert.deepEqual(JSON.parse(stdout), args);
});
