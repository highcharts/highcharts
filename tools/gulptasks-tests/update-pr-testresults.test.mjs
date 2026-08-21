import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import {
    createSubmissionSamples,
    hasVisualTestErrors,
    writeCommentFile
} from '../gulptasks/update-pr-testresults.js';

test('creates API samples from positive visual differences', () => {
    assert.deepEqual(
        createSubmissionSamples({
            'highcharts/demo/unchanged': 0,
            'highcharts/demo/changed': 12
        }),
        [{
            name: 'highcharts/demo/changed',
            comparisonValue: 12
        }]
    );
});

test('detects visual test errors without requiring the file to exist', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'highcharts-visual-results-'));
    const errorPath = join(directory, 'errors.log');
    try {
        assert.equal(hasVisualTestErrors(errorPath), false);
        await writeFile(errorPath, 'browser disconnected\n');
        assert.equal(hasVisualTestErrors(errorPath), true);
    } finally {
        await rm(directory, { recursive: true, force: true });
    }
});

test('writes the PR comment payload', async () => {
    const commentPath = join(process.cwd(), 'tmp', 'pr-visual-test-comment.json');
    try {
        await writeCommentFile('TITLE_TEXT\nBODY_TEXT');
        assert.deepEqual(JSON.parse(await readFile(commentPath, 'utf8')), {
            title: 'TITLE_TEXT',
            body: 'BODY_TEXT'
        });
    } finally {
        await rm(commentPath, { force: true });
    }
});
