import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { lstatSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [command, directory, manifest, metadataBefore] = process.argv.slice(2);
const usage = 'Usage: node distribution.mjs record <directory> <manifest> <metadata-before> | verify <directory> <manifest>';
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
        for (const name of readdirSync(join(root, folder))) {
            if (excludeGit && !folder && name === '.git') {
                continue;
            }
            const relativePath = folder ? `${folder}/${name}` : name;
            const path = join(root, relativePath);
            const stat = lstatSync(path);
            assert(name !== '.git', `Unexpected Git metadata: ${relativePath}`);
            if (stat.isDirectory()) {
                visit(relativePath);
            } else {
                assert(stat.isFile(), `Unexpected file type: ${relativePath}`);
                files.push([relativePath, sha256(readFileSync(path))]);
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
        npm: execFileSync('npm', ['--version'], { encoding: 'utf8' }).trim(),
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
