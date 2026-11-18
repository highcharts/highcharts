import { describe, it } from 'node:test';
import { deepEqual, ok, strictEqual, throws } from 'node:assert';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { chmod, mkdtemp, mkdir, readdir, rm, symlink, utimes, writeFile } from 'node:fs/promises';
import { delimiter, join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';

const require = createRequire(import.meta.url);
const workflow = require('js-yaml').safeLoad(readFileSync(
    new URL('../../.github/workflows/nightly.yml', import.meta.url), 'utf8'
));
const build = workflow.jobs.nightly_dist;
const publisher = workflow.jobs.nightly_dist_publish;
const validation = workflow.jobs.nightly_package_validation;
const summary = workflow.jobs.nightly_package_summary;
const gridLiteValidation = workflow.jobs.nightly_grid_lite_validation;
const visualResultsStep = workflow.jobs.nightly_visual_diff.steps.find(item =>
    item.name === 'Publish nightly visual results'
);
const distributionTool = fileURLToPath(new URL(
    '../nightly-package-validation-prototype/distribution.mjs', import.meta.url
));
const consumerRunner = fileURLToPath(new URL(
    '../nightly-package-validation-prototype/run.mjs', import.meta.url
));
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
        for (const id of ['distribution', 'build_evidence']) {
            const upload = build.steps.find(item => item.id === id);
            ok(upload.with['retention-days'] >= 30, `${id} must survive partial retries`);
        }
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
        strictEqual(build.needs, undefined);
        deepEqual(publisher.needs, [
            'nightly_dist', 'nightly_unit_tests', 'nightly_cypress',
            'nightly_playwright_all_browsers', 'nightly_visual_diff'
        ]);
        strictEqual(publisher.environment, 'nightly-dist');
        const download = publisher.steps.find(item =>
            item.uses?.startsWith('actions/download-artifact@'));
        strictEqual(download.with['artifact-ids'], '${{ needs.nightly_dist.outputs.distribution }}');
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
        strictEqual(step('Upload to github').env.SIGNING_KEY,
            '${{ secrets.DIST_SSH_SIGNING_KEY_BASE64 }}');
        ok(!publisher.steps.some(item =>
            item.uses?.startsWith('actions/setup-node@') ||
            /\b(npm|npx|gulp)\b/u.test(item.run || '')));
    });
});

describe('nightly advisory package validation', () => {
    it('skips visual result publishing only for the Grid Lite pilot dispatch', () => {
        strictEqual(visualResultsStep.if,
            "${{ github.event_name != 'workflow_dispatch' || !inputs.validateGridLite }}");

        function shouldPublish(event, validateGridLite) {
            const expression = visualResultsStep.if
                .slice(3, -2)
                .replace(/github\.event_name\b/gu, JSON.stringify(event))
                .replace(/inputs\.validateGridLite\b/gu, String(validateGridLite));
            return Boolean(runInNewContext(expression));
        }

        strictEqual(shouldPublish('schedule', false), true);
        strictEqual(shouldPublish('workflow_dispatch', false), true);
        strictEqual(shouldPublish('workflow_dispatch', true), false);
    });

    it('runs the Grid Lite pilot only on explicit dispatch, independently of publishing', () => {
        strictEqual(gridLiteValidation.if,
            "${{ github.event_name == 'workflow_dispatch' && inputs.validateGridLite }}");
        strictEqual(gridLiteValidation.needs, undefined);
        strictEqual(gridLiteValidation.environment, undefined);
        ok(!JSON.stringify(gridLiteValidation).includes('secrets.'));
        ok(!publisher.needs.includes('nightly_grid_lite_validation'));
        strictEqual(gridLiteValidation.steps.find(item => item.id === 'evidence').with.name,
            'nightly-grid-lite-validation-${{ github.run_attempt }}');
        ok(gridLiteValidation.steps.find(item => item.id === 'validate').run.includes('--package grid-lite'));
    });

    it('uses the two build artifacts without access to publication credentials', () => {
        strictEqual(validation.needs, 'nightly_dist');
        strictEqual('environment' in validation, false);
        strictEqual(validation.outputs.checks, '${{ steps.validate.outputs.verdict }}');
        strictEqual(validation.outputs.results, '${{ steps.validate.outputs.results }}');
        ok(!JSON.stringify(validation).includes('secrets.'));
        deepEqual(validation.steps.filter(item =>
            item.uses?.startsWith('actions/download-artifact@')
        ).map(item => item.with['artifact-ids']), [
            '${{ needs.nightly_dist.outputs.distribution }}',
            '${{ needs.nightly_dist.outputs.build_evidence }}'
        ]);
        deepEqual(summary.needs, ['nightly_dist', 'nightly_package_validation']);
    });

    const lockDriftCases = [
        { name: 'highcharts', key: 'highcharts', args: [] },
        { name: '@highcharts/grid-lite', key: 'grid-lite', args: ['--package', 'grid-lite'] }
    ];
    for (const { name, key, args } of lockDriftCases) it(`blocks the ${name} candidate when the control lock drifts`, {
        skip: process.platform === 'win32'
    }, async () => {
        await withFixture(async root => {
            const tarball = join(root, 'candidate.tgz');
            const bytes = 'fixture tarball';
            const sha256 = createHash('sha256').update(bytes).digest('hex');
            const integrity = 'sha512-' + createHash('sha512').update(bytes).digest('base64');
            const npm = join(root, 'npm');
            await writeFile(tarball, bytes);
            await writeFile(npm, `#!/usr/bin/env node
const fs = require('node:fs');
const command = process.argv[2];
if (command === 'view') {
    console.log(JSON.stringify({ version: '13.1.1', 'dist.integrity': '${integrity}' }));
} else if (command === 'pack') {
    fs.copyFileSync(process.env.FIXTURE_TARBALL, 'packed-control.tgz');
    console.log('[{"filename":"packed-control.tgz"}]');
} else if (command === '--version') {
    console.log('11.20.0');
} else if (command === 'install') {
    const lock = JSON.parse(fs.readFileSync('package-lock.json'));
    lock.packages['node_modules/${name}'].resolved = 'file:control.tgz';
    lock.packages['node_modules/${name}'].integrity = '${integrity}';
    lock.packages['node_modules/unreviewed'] = { version: '1.0.0' };
    fs.writeFileSync('package-lock.json', JSON.stringify(lock));
} else {
    process.exitCode = 1;
}
`);
            await chmod(npm, 0o755);
            const output = join(root, 'output');
            throws(() => execFileSync(process.execPath, [consumerRunner, tarball, sha256, ...args], {
                cwd: root,
                env: {
                    ...environment,
                    TMPDIR: root,
                    PATH: root + delimiter + process.env.PATH,
                    FIXTURE_TARBALL: tarball,
                    GITHUB_OUTPUT: output
                },
                stdio: 'pipe'
            }), error => error.status === 1);
            const evidence = (await readdir(root)).find(name =>
                name.startsWith(`${key}-package-prototype-`));
            const report = JSON.parse(readFileSync(join(root, evidence, 'results.json'), 'utf8'));
            strictEqual(report.control.outcome, 'blocked');
            ok(report.control.error.includes('Unrelated lock drift'));
            strictEqual(report.candidate.outcome, 'blocked');
            ok(!existsSync(join(root, evidence, 'candidate')));
            const [verdict, results] = readFileSync(output, 'utf8').trim().split('\n');
            strictEqual(verdict, 'verdict=blocked');
            deepEqual(JSON.parse(results.slice('results='.length)), report);
        });
    });

    it('verifies the transferred distribution against the build manifest', async () => {
        await withFixture(async root => {
            const distribution = join(root, 'nightly-dist');
            const transferred = join(root, 'transferred');
            const manifest = join(root, 'build-manifest.json');
            function commit(cwd, message) {
                git(cwd, '-c', 'user.name=Nightly fixture', '-c', 'user.email=nightly@example.test',
                    'commit', '--allow-empty', '-m', message);
                return git(cwd, 'rev-parse', 'HEAD');
            }
            git(root, 'init');
            git(distribution, 'init');
            const source = commit(root, 'source');
            const before = commit(distribution, 'metadata before assembly');
            const after = commit(distribution, 'metadata after assembly');
            await writeFile(join(root, 'package-lock.json'), '{}');
            const runTool = (...args) => execFileSync(process.execPath, [
                distributionTool, ...args
            ], {
                cwd: root,
                env: { ...environment, GITHUB_SHA: source, GITHUB_RUN_ID: '12' },
                stdio: 'pipe'
            });
            runTool('record', distribution, manifest, before, '11.20.0');
            const record = JSON.parse(readFileSync(manifest, 'utf8'));
            strictEqual(record.metadataBefore, before);
            strictEqual(record.metadataAfter, after);
            strictEqual(record.npm, '11.20.0');
            await mkdir(transferred);
            for (const name of ['package.json', 'highcharts.js']) {
                await writeFile(join(transferred, name), readFileSync(join(distribution, name)));
            }
            runTool('verify', transferred, manifest);
            await writeFile(join(transferred, 'highcharts.js'), 'changed');
            throws(() => runTool('verify', transferred, manifest), /Distribution digest mismatch/u);
            if (process.platform !== 'win32') {
                await symlink(join(distribution, 'highcharts.js'), join(transferred, 'link.js'));
                throws(() => runTool('verify', transferred, manifest), /Unexpected file type: link\.js/u);
            }
        });
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
