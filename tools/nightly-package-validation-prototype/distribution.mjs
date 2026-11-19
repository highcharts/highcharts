import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileInventory, readJSON, sha256, writeJSON } from './package-evidence.mjs';

const [command, directory, manifest, metadataBefore, npmVersion] = process.argv.slice(2);
const usage = 'Usage: node distribution.mjs record <directory> <manifest> <metadata-before> <npm-version> | verify <directory> <manifest>';
if (command === '--help') {
    console.log(usage);
    process.exit(0);
}
assert(directory && manifest && ['record', 'verify'].includes(command), usage);

const sourceSha = process.env.GITHUB_SHA;
const runId = process.env.GITHUB_RUN_ID;
assert(sourceSha && runId, 'Expected GitHub source SHA and run ID');
const files = fileInventory(directory, command === 'record');
assert(files.some(([path]) => path === 'highcharts.js'), 'Missing Highcharts entry');
assert(files.some(([path]) => path === 'package.json'), 'Missing package manifest');
const directorySha256 = sha256(JSON.stringify(files));

if (command === 'record') {
    assert(/^[a-f0-9]{40}$/u.test(metadataBefore), 'Expected the initial metadata SHA');
    assert(/^\d+\.\d+\.\d+(?:-[\w.-]+)?$/u.test(npmVersion), 'Expected an npm version');
    const gitHead = cwd => execFileSync('git', ['rev-parse', 'HEAD'], {
        cwd, encoding: 'utf8'
    }).trim();
    assert.equal(gitHead(process.cwd()), sourceSha);
    writeJSON(manifest, {
        sourceSha,
        runId,
        buildAttempt: process.env.GITHUB_RUN_ATTEMPT,
        workflowSha: process.env.GITHUB_WORKFLOW_SHA,
        metadataBefore,
        metadataAfter: gitHead(directory),
        sourceLockSha256: sha256(readFileSync('package-lock.json')),
        node: process.version,
        npm: npmVersion,
        directorySha256,
        files
    });
} else {
    const expected = readJSON(manifest);
    assert.equal(sourceSha, expected.sourceSha, 'Source SHA mismatch');
    assert.equal(runId, expected.runId, 'Run ID mismatch');
    assert.equal(directorySha256, expected.directorySha256, 'Distribution digest mismatch');
    assert.deepEqual(files, expected.files, 'Distribution inventory mismatch');
}
