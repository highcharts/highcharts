import assert from 'node:assert/strict';
import fs from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import ProductMetaPlugin from '../webpacks/plugins/ProductMetaPlugin.mjs';
import UMDExtensionPlugin from '../webpacks/plugins/UMDExtensionPlugin.mjs';

const metadata = new ProductMetaPlugin({
    productName: 'Fixture',
    productVersion: '1.2.3',
    productDate: '2026-11-03'
});
const extension = new UMDExtensionPlugin({ productBundles: ['bundle.js'] });
const cases = [
    ['metadata', metadata, '/**\n * @license @product.name@ ' +
        '@product.version@\n */\nvar message = "é";'],
    ['UMD', extension, '(function webpackUniversalModuleDefinition(root, factory) {\n' +
        'module.exports = factory();\n' +
        'exports["Highcharts"] = factory();\n' +
        'root["Highcharts"] = factory();\n' +
        '})(this, () => {});']
];

function stats(root) {
    return {
        compilation: {
            options: {
                output: {
                    path: root,
                    filename: 'bundle.js'
                }
            }
        }
    };
}

test('metadata plugin leaves normalized read-only output untouched', () => {
    const root = fs.mkdtempSync(join(tmpdir(), 'hc-webpack-readonly-'));
    const output = join(root, 'bundle.js');
    const content = '/**\n * @license Fixture 1.2.3\n */\nvar value = 1;';
    fs.writeFileSync(output, content);
    fs.chmodSync(output, 0o444);
    try {
        assert.doesNotThrow(() => metadata.onDone(stats(root)));
        assert.equal(fs.readFileSync(output, 'utf8'), content);
    } finally {
        fs.chmodSync(output, 0o600);
        fs.rmSync(root, { recursive: true, force: true });
    }
});

for (const [name, plugin, content] of cases) {
    test(`${name} plugin writes the opened output after its pathname changes`, () => {
        const root = fs.mkdtempSync(join(tmpdir(), 'hc-webpack-identity-'));
        const output = join(root, 'bundle.js');
        const original = join(root, 'opened.js');
        const sentinel = join(root, 'unrelated.js');
        fs.writeFileSync(output, content);
        fs.writeFileSync(sentinel, 'untouched');
        const open = fs.openSync;
        const read = fs.readFileSync;
        let descriptor;
        let swapped = false;
        fs.openSync = (file, ...args) => {
            const result = open(file, ...args);
            if (file === output) {
                descriptor = result;
            }
            return result;
        };
        fs.readFileSync = (file, ...args) => {
            const result = read(file, ...args);
            if (!swapped && (file === output || file === descriptor)) {
                fs.renameSync(output, original);
                fs.symlinkSync(sentinel, output);
                swapped = true;
            }
            return result;
        };
        syncBuiltinESMExports();
        try {
            plugin.onDone(stats(root));
            assert.equal(swapped, true);
            assert.equal(read(sentinel, 'utf8'), 'untouched');
            assert.notEqual(read(original, 'utf8'), content);
        } finally {
            fs.openSync = open;
            fs.readFileSync = read;
            syncBuiltinESMExports();
            fs.rmSync(root, { recursive: true, force: true });
        }
    });

    test(`${name} plugin skips missing outputs`, () => {
        const root = fs.mkdtempSync(join(tmpdir(), 'hc-webpack-missing-'));
        try {
            assert.doesNotThrow(() => plugin.onDone(stats(root)));
        } finally {
            fs.rmSync(root, { recursive: true, force: true });
        }
    });
}
