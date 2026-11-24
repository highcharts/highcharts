import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import {
    chmodSync, copyFileSync, lstatSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync
} from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { stripVTControlCharacters } from 'node:util';
import { copyFixture, replayFiles, runnerFiles, writeJSON } from './replay-evidence.mjs';

const directory = fileURLToPath(new URL('.', import.meta.url));

function makeContainerReadable(path) {
    const stat = lstatSync(path);
    if (stat.isDirectory()) {
        chmodSync(path, 0o755);
        for (const name of readdirSync(path)) {
            makeContainerReadable(join(path, name));
        }
    } else {
        assert(stat.isFile(), `Unexpected staged replay file type: ${path}`);
        chmodSync(path, 0o644);
    }
}

export function runReplay({ evidence, archive, gridPackage, sourceSha, runId, attempt }) {
    const checkedOut = execFileSync('git', ['-C', directory, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
    assert(!sourceSha || sourceSha === checkedOut,
        `Check out reviewed source ${sourceSha} in a separate worktree before replay; current HEAD is ${checkedOut}.`);
    const container = process.env.NIGHTLY_REPLAY_CONTAINER ?? 'docker';
    assert(['docker', 'podman'].includes(container), 'Set NIGHTLY_REPLAY_CONTAINER to docker or podman');
    // Keep all host mounts confined to disposable, read-only replay inputs.
    // On macOS, Podman Machine shares the home directory by default.
    const stagingParent = container === 'podman' && process.platform === 'darwin' ? homedir() : tmpdir();
    const staging = mkdtempSync(join(stagingParent, 'highcharts-replay-'));
    const name = staging.slice(staging.lastIndexOf('highcharts-replay-'));
    const input = join(staging, 'input');
    const build = join(staging, 'build');
    let launched = false;
    try {
        mkdirSync(input);
        mkdirSync(build);
        const fixture = join(input, 'fixture');
        copyFixture(directory, fixture, gridPackage);
        writeJSON(join(input, 'identity.json'), { sourceSha: checkedOut, runId, attempt, gridPackage });
        for (const file of runnerFiles) {
            copyFileSync(join(directory, file), join(input, file));
        }
        for (const file of ['package.json', 'package-lock.json']) {
            copyFileSync(join(fixture, file), join(build, file));
        }
        copyFileSync(join(directory, 'replay.Dockerfile'), join(build, 'Dockerfile'));
        if (archive) {
            copyFileSync(archive, join(input, 'validation.zip'));
        } else {
            assert(lstatSync(evidence).isDirectory(), 'Retained evidence must be a directory');
            for (const name of ['replay.json', ...replayFiles(evidence)]) {
                const source = join(evidence, name);
                assert(lstatSync(source).isFile(), `Unexpected replay file type: ${name}`);
                const destination = join(input, 'evidence', name);
                mkdirSync(dirname(destination), { recursive: true });
                copyFileSync(source, destination);
            }
        }
        // The container runs as pwuser. The enclosing staging directory stays private on the host.
        makeContainerReadable(input);
        makeContainerReadable(build);
        const imageId = join(staging, 'image-id');
        execFileSync(container, ['build', '--platform', 'linux/amd64', '--iidfile', imageId, build], {
            stdio: 'inherit'
        });
        const image = readFileSync(imageId, 'utf8').trim();
        assert(/^(?:sha256:)?[a-f0-9]{64}$/u.test(image), 'Invalid replay image ID');
        const source = `source=${input}`;
        const mountSource = /[,"]/u.test(source) ? `"${source.replaceAll('"', '""')}"` : source;
        const mount = `type=bind,${mountSource},target=/replay,readonly`;
        launched = true;
        const { status, error, stdout, stderr } = spawnSync(container, [
            'run', '--rm', '--name', name, '--platform', 'linux/amd64', '--network', 'none',
            '--user', 'pwuser', '--cap-drop', 'ALL', '--security-opt', 'no-new-privileges',
            '--shm-size', '512m', '--pids-limit', '512', '--mount', mount,
            '--entrypoint', '/usr/bin/env', image, '-i', 'HOME=/home/pwuser',
            'PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
            'PLAYWRIGHT_BROWSERS_PATH=/ms-playwright', 'npm_config_cache=/home/pwuser/replay-cache',
            'node', '/replay/replay-worker.mjs'
        ], { encoding: 'utf8', timeout: 25 * 60_000 });
        const sanitize = value => stripVTControlCharacters(value ?? '').replace(/[\u0000-\u0008\u000b-\u001f\u007f-\u009f]/gu, '');
        process.stdout.write(sanitize(stdout));
        process.stderr.write(sanitize(stderr));
        if (error) {
            throw error;
        }
        return status ?? 1;
    } finally {
        if (launched) {
            spawnSync(container, ['rm', '-f', name], { stdio: 'ignore' });
        }
        rmSync(staging, { recursive: true, force: true });
    }
}
