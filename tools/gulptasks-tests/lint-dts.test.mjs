import { describe, it } from 'node:test';
import { deepStrictEqual, strictEqual } from 'node:assert';
import { createRequire } from 'node:module';
import { readdirSync, lstatSync } from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const {
    isAllowedTestFolder,
    FOLDER_NAMES_WHITELIST,
    TEST_FOLDER
} = require('../gulptasks/lint-dts.js');

describe('lint-dts folder whitelist', () => {
    it('accepts whitelisted folders under test/typescript-dts', () => {
        strictEqual(
            isAllowedTestFolder(path.join(TEST_FOLDER, 'highcharts')),
            true
        );
        strictEqual(
            isAllowedTestFolder(path.join(TEST_FOLDER, 'highcharts-3d')),
            true
        );
    });

    it('rejects folder names with shell metacharacters', () => {
        strictEqual(
            isAllowedTestFolder(path.join(TEST_FOLDER, 'foo;curl evil.com')),
            false
        );
        strictEqual(
            isAllowedTestFolder(path.join(TEST_FOLDER, '$(whoami)')),
            false
        );
    });

    it('rejects whitelisted names outside test/typescript-dts', () => {
        strictEqual(
            isAllowedTestFolder(path.join('tmp', 'highcharts')),
            false
        );
        strictEqual(
            isAllowedTestFolder(path.join(TEST_FOLDER, '..', 'highcharts')),
            false
        );
    });

    it('rejects names that are not on the whitelist', () => {
        strictEqual(
            isAllowedTestFolder(path.join(TEST_FOLDER, 'not-a-real-suite')),
            false
        );
    });

    it('covers every immediate subdirectory of test/typescript-dts', () => {
        const directories = readdirSync(TEST_FOLDER).filter(entry => (
            lstatSync(path.join(TEST_FOLDER, entry)).isDirectory()
        ));

        deepStrictEqual(
            directories.sort(),
            [...FOLDER_NAMES_WHITELIST].sort()
        );

        directories.forEach(entry => {
            strictEqual(
                isAllowedTestFolder(path.join(TEST_FOLDER, entry)),
                true,
                `Expected ${entry} to pass the whitelist`
            );
        });
    });
});
