import assert from 'node:assert/strict';
import fs from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { updateFile } from '../libs/fs.js';

function withFile(check) {
    const root = fs.mkdtempSync(join(tmpdir(), 'hc-update-file-'));
    const file = join(root, 'output.txt');
    fs.writeFileSync(file, 'original contents');
    try {
        check(file);
    } finally {
        fs.rmSync(root, { recursive: true, force: true });
    }
}

test('replaces shorter and longer UTF-8 content without appending', () => {
    withFile(file => {
        for (const content of ['é', 'a longer Unicode value: 世界', '']) {
            updateFile(file, () => content);
            assert.equal(fs.readFileSync(file, 'utf8'), content);
        }
    });
});

test('updates the opened file when its pathname is replaced', () => {
    withFile(file => {
        const original = file + '.opened';
        const sentinel = file + '.unrelated';
        fs.writeFileSync(sentinel, 'untouched');
        updateFile(file, content => {
            fs.renameSync(file, original);
            fs.symlinkSync(sentinel, file);
            return content + ' updated';
        });
        assert.equal(fs.readFileSync(sentinel, 'utf8'), 'untouched');
        assert.equal(fs.readFileSync(original, 'utf8'), 'original contents updated');
    });
});
