import { describe, it } from 'node:test';
import { deepEqual, ok, strictEqual, throws } from 'node:assert';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { chmod, mkdtemp, mkdir, readdir, rm, symlink, utimes, writeFile } from 'node:fs/promises';
import { delimiter, join } from 'node:path';
import { tmpdir } from 'node:os';
import { runInNewContext } from 'node:vm';

const require = createRequire(import.meta.url);
const workflow = require('js-yaml').safeLoad(readFileSync(
    new URL('../../.github/workflows/nightly.yml', import.meta.url), 'utf8'
));
const build = workflow.jobs.nightly_dist;
const publisher = workflow.jobs.nightly_dist_publish;
function step(name) {
    return publisher.steps.find(item => item.name === name);
}

const environment = {
    ...process.env,
    GIT_CONFIG_NOSYSTEM: '1',
    GIT_CONFIG_GLOBAL: process.platform === 'win32' ? 'NUL' : '/dev/null'
};
function git(cwd, ...args) {
    return execFileSync('git', args, {
        cwd, env: environment, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']
    }).trim();
}

function run(script, cwd, env = {}) {
    return execFileSync('bash', ['-e', '-o', 'pipefail', '-c', script], {
        cwd, env: { ...environment, ...env }, stdio: 'pipe'
    });
}

async function withFixture(check) {
    const root = await mkdtemp(join(tmpdir(), 'hc-nightly-dist-'));
    try {
        await mkdir(join(root, 'nightly-dist'));
        await writeFile(join(root, 'nightly-dist/highcharts.js'), 'new build');
        await writeFile(join(root, 'nightly-dist/package.json'), JSON.stringify({
            version: '13.0.2',
            scripts: { prepare: 'touch executed-artifact-code' }
        }));
        await check(root);
    } finally {
        await rm(root, { recursive: true, force: true });
    }
}

describe('nightly distribution credential boundary', () => {
    it('builds the run SHA without publication credentials or an environment', () => {
        ok(!JSON.stringify(build).includes('secrets.'));
        strictEqual('environment' in build, false);
        for (const checkout of build.steps.filter(item =>
            item.uses?.startsWith('actions/checkout@'))) {
            strictEqual(checkout.with['persist-credentials'], false);
        }
        strictEqual(build.steps[0].with.ref, '${{ github.sha }}');
        const artifact = build.steps.find(item =>
            item.uses?.startsWith('actions/upload-artifact@'));
        ok(artifact.with.path.includes('!highcharts-dist/.git'));
        strictEqual(artifact.with['include-hidden-files'], true);
    });

    it('publishes only master schedule or opted-in master dispatch runs', () => {
        function allowed(ref, event, pushToDist) {
            const expression = publisher.if
                .slice(3, -2)
                .replace(/github\.ref\b/gu, JSON.stringify(ref))
                .replace(/github\.event_name\b/gu, JSON.stringify(event))
                .replace(/inputs\.pushToDist\b/gu, String(pushToDist));
            return Boolean(runInNewContext(expression));
        }
        for (const ref of ['refs/heads/master', 'refs/heads/feature', 'refs/tags/master']) {
            strictEqual(allowed(ref, 'schedule', false), ref === 'refs/heads/master');
            strictEqual(allowed(ref, 'workflow_dispatch', true), ref === 'refs/heads/master');
            strictEqual(allowed(ref, 'workflow_dispatch', false), false);
        }
        strictEqual(allowed('refs/heads/master', 'pull_request', false), false);
    });

    it('consumes the same-run artifact in an isolated environment job', () => {
        strictEqual(publisher.needs, 'nightly_dist');
        strictEqual(publisher.environment, 'nightly-dist');
        const download = publisher.steps.find(item =>
            item.uses?.startsWith('actions/download-artifact@'));
        strictEqual(download.with.name, 'nightly-dist-${{ github.sha }}');
        strictEqual('run-id' in download.with, false);
        strictEqual('repository' in download.with, false);
        const checkout = publisher.steps.find(item =>
            item.uses?.startsWith('actions/checkout@'));
        strictEqual(checkout.with.repository, 'highcharts/highcharts-dist');
        strictEqual(checkout.with.ref, 'nightly');
        strictEqual(checkout.with.token, '${{ secrets.NIGHTLY_DIST_TOKEN }}');
        ok(publisher.steps.indexOf(step('Validate distribution artifact')) <
            publisher.steps.indexOf(checkout));
        ok(!JSON.stringify(publisher).includes('PR_COMMENT_TOKEN'));
        ok(!JSON.stringify(publisher).includes('secrets.DIST_SSH_SIGNING_KEY_BASE64'));
        ok(!publisher.steps.some(item =>
            item.uses?.startsWith('actions/setup-node@') ||
            /\b(npm|npx|gulp)\b/u.test(item.run || '')));
    });
});

describe('nightly artifact publication', { skip: process.platform === 'win32' }, () => {
    it('fails closed if artifact inspection fails', async () => {
        await withFixture(async root => {
            const bin = join(root, 'bin');
            await mkdir(bin);
            await writeFile(join(bin, 'find'), '#!/bin/sh\nexit 1\n');
            await chmod(join(bin, 'find'), 0o755);
            throws(() => run(step('Validate distribution artifact').run, root, {
                PATH: bin + delimiter + process.env.PATH
            }), error => error.status === 1);
        });
    });

    it('rejects Git metadata, symlinks and special files before checkout', async () => {
        for (const malicious of [
            '.git', '.git/config', 'modules/.git', 'modules/.git/config',
            'linked.js', 'pipe'
        ]) {
            await withFixture(async root => {
                const path = join(root, 'nightly-dist', malicious);
                await mkdir(join(path, '..'), { recursive: true });
                if (malicious === 'linked.js') {
                    await symlink('../outside', path);
                } else if (malicious === 'pipe') {
                    execFileSync('mkfifo', [path]);
                } else {
                    await writeFile(path, 'gitdir: /outside');
                }
                throws(() => run(step('Validate distribution artifact').run, root),
                    error => error.stdout?.includes('Distribution artifact contains'));
            });
        }
    });

    it('copies data without executing it, signs a fast-forward commit and handles a no-op', async () => {
        await withFixture(async root => {
            const repo = join(root, 'highcharts-dist');
            const remote = join(root, 'remote.git');
            const key = join(root, 'signing-key');
            await mkdir(repo);
            await writeFile(join(root, 'nightly-dist/.npmignore'), 'hidden metadata');
            await writeFile(join(repo, 'highcharts.js'), 'old build');
            await writeFile(join(repo, 'obsolete.js'), 'remove me');
            const timestamp = new Date('2020-01-01T00:00:00Z');
            for (const file of ['nightly-dist/highcharts.js', 'highcharts-dist/highcharts.js']) {
                await utimes(join(root, file), timestamp, timestamp);
            }
            git(root, 'init', '--bare', remote);
            git(repo, 'init', '--initial-branch=nightly');
            git(repo, 'config', 'user.name', 'Nightly fixture');
            git(repo, 'config', 'user.email', 'nightly@example.test');
            git(repo, 'add', '--all');
            git(repo, 'commit', '-m', 'Initial nightly');
            git(repo, 'remote', 'add', 'origin', remote);
            git(repo, 'push', 'origin', 'HEAD:refs/heads/nightly');
            const before = git(repo, 'rev-parse', 'HEAD');
            execFileSync('ssh-keygen', ['-q', '-t', 'ed25519', '-N', '', '-f', key]);
            const signingKey = readFileSync(key).toString('base64');
            const script = step('Upload to github').run;
            run(step('Validate distribution artifact').run, root);
            run(step('Copy distribution files').run, root);
            run(script, repo, {
                SIGNING_KEY: signingKey, RUNNER_TEMP: root, GITHUB_RUN_ID: '123'
            });
            strictEqual(git(repo, 'rev-parse', 'HEAD^'), before);
            const published = git(repo, 'rev-parse', 'HEAD');
            strictEqual(git(root, '--git-dir', remote, 'rev-parse', 'nightly'), published);
            strictEqual(git(repo, 'show', 'HEAD:highcharts.js'), 'new build');
            strictEqual(git(repo, 'show', 'HEAD:.npmignore'), 'hidden metadata');
            ok(!existsSync(join(repo, 'obsolete.js')));
            ok(!existsSync(join(repo, 'executed-artifact-code')));
            ok(!(await readdir(root)).some(name => name.startsWith('nightly-signing-key.')));
            const signers = join(root, 'allowed-signers');
            await writeFile(signers, 'technical+circleci_mu@highsoft.com ' +
                readFileSync(key + '.pub', 'utf8'));
            git(repo, 'config', 'gpg.ssh.allowedSignersFile', signers);
            strictEqual(git(repo, 'show', '-s', '--format=%G?'), 'G');
            run(script, repo, { RUNNER_TEMP: root, GITHUB_RUN_ID: '124' });
            strictEqual(git(repo, 'rev-parse', 'HEAD'), published);
            deepEqual(git(repo, 'ls-files').split('\n').sort(),
                ['.npmignore', 'highcharts.js', 'package.json']);
        });
    });
});
