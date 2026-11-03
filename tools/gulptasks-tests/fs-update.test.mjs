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

test('completes partial writes at byte offsets', () => {
    withFile(file => {
        const write = fs.writeSync;
        fs.writeSync = (descriptor, bytes, offset, length, position) =>
            write(descriptor, bytes, offset, Math.min(length, 2), position);
        try {
            updateFile(file, () => 'é世界');
        } finally {
            fs.writeSync = write;
        }
        assert.equal(fs.readFileSync(file, 'utf8'), 'é世界');
    });
});

test('skips only missing optional files and intentional no-op transforms', () => {
    withFile(file => {
        let called = false;
        updateFile(file + '.missing', () => {
            called = true;
        }, {
            optional: true
        });
        assert.equal(called, false);
        assert.throws(() => updateFile(file + '.missing', () => ''), {
            code: 'ENOENT'
        });
        updateFile(file, () => {});
        assert.equal(fs.readFileSync(file, 'utf8'), 'original contents');
        assert.throws(() => updateFile(file, () => {
            throw Object.assign(new Error('transform failed'), { code: 'ENOENT' });
        }, { optional: true }), /transform failed/u);
        assert.equal(fs.readFileSync(file, 'utf8'), 'original contents');
    });
});

test('closes the opened descriptor when a transform fails', () => {
    withFile(file => {
        const open = fs.openSync;
        let descriptor;
        fs.openSync = (...args) => {
            descriptor = open(...args);
            return descriptor;
        };
        try {
            assert.throws(() => updateFile(file, () => {
                throw new Error('failed');
            }), /failed/u);
            assert.throws(() => fs.fstatSync(descriptor), { code: 'EBADF' });
        } finally {
            fs.openSync = open;
        }
    });
});

test('allows read-only no-ops without bypassing write permission errors', () => {
    withFile(file => {
        const open = fs.openSync;
        const denied = Object.assign(new Error('read-only output'), {
            code: 'EACCES'
        });
        fs.openSync = (path, flags) => {
            if (flags === 'r+') {
                throw denied;
            }
            return open(path, flags);
        };
        try {
            updateFile(file, () => {});
            assert.throws(() => updateFile(file, () => 'changed'),
                error => error === denied);
        } finally {
            fs.openSync = open;
        }
        assert.equal(fs.readFileSync(file, 'utf8'), 'original contents');
    });
});
