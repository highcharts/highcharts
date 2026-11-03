import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

const sourceURL = new URL('../gulptasks/scripts-css.js', import.meta.url);
const require = createRequire(sourceURL);
const module = { exports: {} };
runInNewContext(fs.readFileSync(sourceURL, 'utf8') +
    '\nmodule.exports = replaceProductVersionInFiles;', {
    module,
    __dirname: dirname(fileURLToPath(sourceURL)),
    require: name => (name === 'gulp' ? { task() {} } : require(name))
});
const replaceVersions = module.exports;

function withDirectory(check) {
    const root = fs.mkdtempSync(join(tmpdir(), 'hc-css-identity-'));
    const folder = join(root, 'css');
    const properties = join(root, 'properties.json');
    fs.mkdirSync(folder);
    fs.writeFileSync(properties, JSON.stringify({ version: '2.3.4-rc.1+build.7' }));
    try {
        check({ root, folder, properties });
    } finally {
        fs.rmSync(root, { recursive: true, force: true });
    }
}

test('CSS replacement preserves files, file symlinks and directory skips', () => {
    withDirectory(({ root, folder, properties }) => {
        const version = '2.3.4-rc.1+build.7';
        const target = join(root, 'target.css');
        fs.writeFileSync(join(folder, 'plain.css'), 'α @product.version@ @product.version@');
        fs.writeFileSync(join(folder, 'unchanged.css'), 'unchanged');
        fs.writeFileSync(target, '@product.version@');
        fs.symlinkSync(target, join(folder, 'linked.css'));
        fs.mkdirSync(join(folder, 'nested'));
        fs.writeFileSync(join(folder, 'nested', 'skip.css'), '@product.version@');
        fs.symlinkSync(join(folder, 'nested'), join(folder, 'linked-directory'));

        replaceVersions(folder, properties);

        assert.equal(fs.readFileSync(join(folder, 'plain.css'), 'utf8'),
            `α ${version} ${version}`);
        assert.equal(fs.readFileSync(join(folder, 'unchanged.css'), 'utf8'), 'unchanged');
        assert.equal(fs.readFileSync(target, 'utf8'), version);
        assert.equal(fs.readFileSync(join(folder, 'nested', 'skip.css'), 'utf8'),
            '@product.version@');
    });
});

test('CSS replacement cannot overwrite a substituted pathname target', () => {
    withDirectory(({ root, folder, properties }) => {
        const file = join(folder, 'main.css');
        const original = join(root, 'opened.css');
        const sentinel = join(root, 'unrelated.css');
        fs.writeFileSync(file, '@product.version@');
        fs.writeFileSync(sentinel, 'untouched');
        const open = fs.openSync;
        const read = fs.readFileSync;
        let descriptor;
        let swapped = false;
        fs.openSync = (path, ...args) => {
            const result = open(path, ...args);
            if (path === file) {
                descriptor = result;
            }
            return result;
        };
        fs.readFileSync = (path, ...args) => {
            const result = read(path, ...args);
            if (!swapped && (path === file || path === descriptor)) {
                fs.renameSync(file, original);
                fs.symlinkSync(sentinel, file);
                swapped = true;
            }
            return result;
        };
        try {
            replaceVersions(folder, properties);
            assert.equal(swapped, true);
            assert.equal(read(sentinel, 'utf8'), 'untouched');
            assert.equal(read(original, 'utf8'), '2.3.4-rc.1+build.7');
        } finally {
            fs.openSync = open;
            fs.readFileSync = read;
        }
    });
});

test('CSS replacement propagates invalid metadata and file errors', () => {
    withDirectory(({ root, folder, properties }) => {
        const file = join(folder, 'broken.css');
        fs.symlinkSync(join(root, 'missing'), file);
        assert.throws(() => replaceVersions(folder, properties), { code: 'ENOENT' });
        fs.writeFileSync(properties, '{');
        assert.throws(() => replaceVersions(folder, properties), { name: 'SyntaxError' });
    });
});
