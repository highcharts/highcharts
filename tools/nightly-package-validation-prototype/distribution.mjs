import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
    closeSync, constants, fstatSync, lstatSync, openSync, readFileSync,
    readdirSync, writeFileSync
} from 'node:fs';
import { join } from 'node:path';

const [command, directory, manifest, metadataBefore, npmVersion] = process.argv.slice(2);
const usage = 'Usage: node distribution.mjs record <directory> <manifest> <metadata-before> <npm-version> | verify <directory> <manifest>';
if (command === '--help') {
    console.log(usage);
    process.exit(0);
}
assert(directory && manifest && ['record', 'verify'].includes(command), usage);

function sha256(bytes) {
    return createHash('sha256').update(bytes).digest('hex');
}

function inventory(root, excludeGit) {
    assert(lstatSync(root).isDirectory(), 'Expected a distribution directory');
    const files = [];
    function visit(folder = '') {
        for (const entry of readdirSync(join(root, folder), { withFileTypes: true })) {
            const { name } = entry;
            if (excludeGit && !folder && name === '.git') {
                continue;
            }
            const relativePath = folder ? `${folder}/${name}` : name;
            const path = join(root, relativePath);
            assert(name !== '.git', `Unexpected Git metadata: ${relativePath}`);
            if (entry.isDirectory()) {
                visit(relativePath);
            } else {
                assert(entry.isFile(), `Unexpected file type: ${relativePath}`);
                const fd = openSync(path, constants.O_RDONLY |
                    (constants.O_NOFOLLOW ?? 0) | (constants.O_NONBLOCK ?? 0));
                try {
                    assert(fstatSync(fd).isFile(), `Unexpected file type: ${relativePath}`);
                    files.push([relativePath, sha256(readFileSync(fd))]);
                } finally {
                    closeSync(fd);
                }
            }
        }
    }
    visit();
    files.sort(([left], [right]) => (left < right ? -1 : Number(left > right)));
    assert(files.some(([path]) => path === 'highcharts.js'), 'Missing Highcharts entry');
    assert(files.some(([path]) => path === 'package.json'), 'Missing package manifest');
    return files;
}

const sourceSha = process.env.GITHUB_SHA;
const runId = process.env.GITHUB_RUN_ID;
assert(sourceSha && runId, 'Expected GitHub source SHA and run ID');
const files = inventory(directory, command === 'record');
const directorySha256 = sha256(JSON.stringify(files));

if (command === 'record') {
    assert(/^[a-f0-9]{40}$/u.test(metadataBefore), 'Expected the initial metadata SHA');
    assert(/^\d+\.\d+\.\d+(?:-[\w.-]+)?$/u.test(npmVersion), 'Expected an npm version');
    const gitHead = cwd => execFileSync('git', ['rev-parse', 'HEAD'], {
        cwd, encoding: 'utf8'
    }).trim();
    assert.equal(gitHead(process.cwd()), sourceSha);
    writeFileSync(manifest, JSON.stringify({
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
    }, null, 2) + '\n');
} else {
    const expected = JSON.parse(readFileSync(manifest, 'utf8'));
    assert.equal(sourceSha, expected.sourceSha, 'Source SHA mismatch');
    assert.equal(runId, expected.runId, 'Run ID mismatch');
    assert.equal(directorySha256, expected.directorySha256, 'Distribution digest mismatch');
    assert.deepEqual(files, expected.files, 'Distribution inventory mismatch');
}
