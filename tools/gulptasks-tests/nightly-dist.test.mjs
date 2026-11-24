import { describe, it } from 'node:test';
import { deepEqual, ok, strictEqual, throws } from 'node:assert';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { chmod, mkdtemp, mkdir, readdir, rename, rm, symlink, utimes, writeFile } from 'node:fs/promises';
import { delimiter, dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { writeCandidateProvenance } from './fixtures/nightly-package-evidence.mjs';

const require = createRequire(import.meta.url);
const workflow = require('js-yaml').safeLoad(readFileSync(
    new URL('../../.github/workflows/nightly.yml', import.meta.url), 'utf8'
));
const build = workflow.jobs.nightly_dist;
const publisher = workflow.jobs.nightly_dist_publish;
const validation = workflow.jobs.nightly_package_validation;
const summary = workflow.jobs.nightly_package_summary;
const gridLiteValidation = workflow.jobs.nightly_grid_lite_validation;
const gridProValidation = workflow.jobs.nightly_grid_pro_validation;
const visualPublication = workflow.jobs.nightly_visual_diff.steps.find(item =>
    item.name === 'Publish nightly visual results');
const distributionTool = fileURLToPath(new URL(
    '../nightly-package-validation-prototype/distribution.mjs', import.meta.url
));
const consumerRunner = fileURLToPath(new URL(
    '../nightly-package-validation-prototype/run.mjs', import.meta.url
));
const prototype = dirname(consumerRunner);
const nightly = { sourceSha: 'a'.repeat(40), runId: '123', attempt: '2' };
const nightlyEnv = {
    GITHUB_SHA: nightly.sourceSha, GITHUB_RUN_ID: nightly.runId, GITHUB_RUN_ATTEMPT: nightly.attempt
};
function conditionAllows(item, event, inputs = {}, ref = 'refs/heads/master') {
    return Boolean(runInNewContext(item.if.slice(3, -2), {
        github: { event_name: event, ref }, inputs
    }));
}

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

    it('rejects unsafe distribution entries before the required artifact upload', {
        skip: process.platform === 'win32'
    }, async () => {
        const guard = build.steps.find(item => item.name === 'Validate assembled distribution tree');
        const assembly = build.steps.find(item => item.name === 'Install and build');
        const upload = build.steps.find(item => item.id === 'distribution');
        ok(build.steps.indexOf(assembly) < build.steps.indexOf(guard));
        ok(build.steps.indexOf(guard) < build.steps.indexOf(upload));
        strictEqual(guard.if, undefined);
        strictEqual(guard['continue-on-error'], undefined);

        await withFixture(async root => {
            const distribution = join(root, 'highcharts-dist');
            await rename(join(root, 'nightly-dist'), distribution);
            await writeFile(join(distribution, '.npmignore'), 'hidden metadata');
            await mkdir(join(distribution, '.git/objects'), { recursive: true });
            await symlink('missing', join(distribution, '.git/objects/ignored'));
            run(guard.run, root);
            await rm(join(distribution, '.git'), { recursive: true });

            const cases = [
                ['.git', path => writeFile(path, 'gitdir: ../metadata')],
                ['.git', path => symlink(root, path)],
                ['nested/.git', path => writeFile(path, 'gitdir: ../../metadata')],
                ['nested/.git', path => mkdir(path)],
                ['linked.js', path => symlink('highcharts.js', path)],
                ['linked-dir', path => symlink('nested', path)],
                ['broken-link', path => symlink('missing', path)],
                ['pipe', path => execFileSync('mkfifo', [path])]
            ];
            await mkdir(join(distribution, 'nested'));
            for (const [name, create] of cases) {
                const path = join(distribution, name);
                await create(path);
                throws(() => run(guard.run, root), error =>
                    error.status === 1 && error.stdout?.includes(
                        'Assembled distribution contains unexpected Git metadata or special files.'
                    ), name);
                await rm(path, { recursive: true });
            }

            const original = join(root, 'original');
            await rename(distribution, original);
            await symlink(original, distribution);
            throws(() => run(guard.run, root), error =>
                error.status === 1 && error.stdout?.includes(
                    'Expected a regular highcharts-dist directory.'
                ));
        });
    });

    it('publishes only master schedule or opted-in master dispatch runs', () => {
        for (const ref of ['refs/heads/master', 'refs/heads/feature', 'refs/tags/master']) {
            strictEqual(conditionAllows(publisher, 'schedule', {}, ref), ref === 'refs/heads/master');
            strictEqual(conditionAllows(publisher, 'workflow_dispatch', { pushToDist: true }, ref),
                ref === 'refs/heads/master');
            strictEqual(conditionAllows(publisher, 'workflow_dispatch', { pushToDist: false }, ref), false);
        }
        strictEqual(conditionAllows(publisher, 'pull_request'), false);
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
    for (const [label, key, job] of [
        ['Lite', 'grid-lite', gridLiteValidation],
        ['Pro', 'grid-pro', gridProValidation]
    ]) {
        it(`runs the Grid ${label} pilot only on explicit dispatch, independently of publishing`, () => {
            const inputs = workflow.on.workflow_dispatch.inputs;
            strictEqual(inputs[`validateGrid${label}`].default, false);
            strictEqual(inputs[`grid${label}MissingCss`].default, false);
            const validationInputs = { [`validateGrid${label}`]: true };
            strictEqual(conditionAllows(job, 'schedule'), false);
            strictEqual(conditionAllows(job, 'workflow_dispatch'), false);
            strictEqual(conditionAllows(job, 'workflow_dispatch', validationInputs), true);
            strictEqual(job.needs, undefined);
            strictEqual(job.environment, undefined);
            ok(!JSON.stringify(job).includes('secrets.'));
            ok(!publisher.needs.includes(`nightly_${key.replace('-', '_')}_validation`));
            strictEqual(job.env.GRID_PACKAGE, key);
            strictEqual(job.env.GRID_MISSING_CSS, `\${{ inputs.grid${label}MissingCss }}`);
            ok(/^[a-f0-9]{40}$/u.test(job.env.GRID_METADATA_SHA));
            const checkout = job.steps.find(item => item.id === 'metadata');
            strictEqual(checkout.with.repository, 'highcharts/${{ env.GRID_PACKAGE }}-dist');
            strictEqual(checkout.with.ref, '${{ env.GRID_METADATA_SHA }}');
            strictEqual(checkout.with['persist-credentials'], false);
            const artifact = job.steps.find(item => item.id === 'evidence').with.name;
            strictEqual(artifact.replace('${{ env.GRID_PACKAGE }}', key),
                `nightly-${key}-validation-\${{ github.run_attempt }}`);
            ok(job.steps.find(item => item.id === 'validate').run.includes('--package "$GRID_PACKAGE"'));
        });
    }

    it('skips Visual Review publication for Grid Lite validation dispatches', () => {
        strictEqual(conditionAllows(visualPublication, 'schedule'), true);
        strictEqual(conditionAllows(visualPublication, 'workflow_dispatch'), true);
        strictEqual(conditionAllows(visualPublication, 'workflow_dispatch', { validateGridLite: true }), false);
    });

    it('starts Grid Pro validation and skips both publishers when either Pro input is true', () => {
        for (const inputs of [
            { pushToDist: true, validateGridPro: true, gridProMissingCss: false },
            { pushToDist: true, validateGridPro: false, gridProMissingCss: true },
            { pushToDist: true, validateGridPro: true, gridProMissingCss: true }
        ]) {
            strictEqual(conditionAllows(gridProValidation, 'workflow_dispatch', inputs), true);
            strictEqual(conditionAllows(visualPublication, 'workflow_dispatch', inputs), false);
            strictEqual(conditionAllows(publisher, 'workflow_dispatch', inputs), false);
        }
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

    it('keeps build evidence optional for the required distribution job', () => {
        const assembly = build.steps.find(item => item.name === 'Install and build');
        const distribution = build.steps.find(item => item.id === 'distribution');
        const record = build.steps.find(item => item.id === 'record_evidence');
        const upload = build.steps.find(item => item.id === 'build_evidence');
        ok(!assembly.run.includes('distribution.mjs'));
        strictEqual(distribution.if, undefined);
        strictEqual(distribution['continue-on-error'], undefined);
        ok(build.steps.indexOf(distribution) < build.steps.indexOf(record));
        strictEqual(record.if, validation.if);
        strictEqual(record['continue-on-error'], true);
        strictEqual(upload.if, "${{ steps.record_evidence.outcome == 'success' }}");
        strictEqual(upload['continue-on-error'], true);
        strictEqual(build.outputs.build_evidence,
            "${{ steps.build_evidence.outcome == 'success' && steps.build_evidence.outputs.artifact-id || '' }}");
        for (const [event, dispatch, schedule, expected] of [
            ['schedule', false, 'false', false],
            ['schedule', false, 'true', true],
            ['workflow_dispatch', false, 'true', false],
            ['workflow_dispatch', true, 'false', true]
        ]) {
            strictEqual(runInNewContext(record.if.slice(3, -2), {
                github: { event_name: event },
                inputs: { validateDistribution: dispatch },
                vars: { NIGHTLY_PACKAGE_VALIDATION: schedule }
            }), expected);
        }
    });

    it('directs missing build evidence to a new dispatch with distribution publishing disabled', {
        skip: process.platform === 'win32'
    }, async () => {
        const check = validation.steps.find(item => item.id === 'artifacts');
        strictEqual(check['continue-on-error'], undefined);
        await withFixture(async root => {
            const output = join(root, 'output');
            const env = { DISTRIBUTION: '123', BUILD_EVIDENCE: '456', GITHUB_OUTPUT: output };
            run(check.run, root, env);
            ok(!existsSync(output));
            const recovery = 'gh workflow run nightly.yml --ref "$REF" -f validateDistribution=true -f pushToDist=false';
            throws(() => run(check.run, root, { ...env, BUILD_EVIDENCE: '' }), error =>
                error.status === 1 && error.stdout?.includes(recovery));
            const diagnostic = readFileSync(output, 'utf8');
            ok(diagnostic.startsWith('diagnostic='));
            ok(diagnostic.includes('nightly_dist job'));
            ok(diagnostic.includes('start a new validation run with distribution publishing disabled'));
            ok(diagnostic.includes(recovery));
        });
    });

    const core = { name: 'highcharts', key: 'highcharts', args: [] };
    const grid = { name: '@highcharts/grid-lite', key: 'grid-lite', args: ['--package', 'grid-lite'], prepared: true };
    const pro = { name: '@highcharts/grid-pro', key: 'grid-pro', args: ['--package', 'grid-pro'], prepared: true };
    const resolutionError = peer => [
        'npm error code ERESOLVE',
        'npm error ERESOLVE unable to resolve dependency tree',
        'npm error',
        'npm error Could not resolve dependency:',
        `npm error ${peer}`
    ].join('\n');
    const candidatePeer = 'peerOptional vite@"^7.0.0 || ^6.0.0" from @highcharts/grid-lite@4.0.0';
    const gridReactPeer = 'peer @highcharts/grid-lite@">=3.1.0" from @highcharts/grid-lite-react@3.3.0';
    const peerCases = [
        {
            test: 'fails when the candidate requires an incompatible peer at lock resolution',
            command: 'install', diagnostic: resolutionError(candidatePeer), error: `ERESOLVE: ${candidatePeer}`,
            verdict: 'failed'
        },
        {
            test: 'fails when Grid Lite React rejects the candidate as a peer at install',
            command: 'ci', diagnostic: resolutionError(gridReactPeer),
            error: `ERESOLVE: ${gridReactPeer}`, verdict: 'failed'
        },
        {
            test: 'blocks when npm reports a registry error alongside a peer warning',
            command: 'ci', diagnostic: [resolutionError(candidatePeer).replaceAll('npm error', 'npm warn'),
                'npm error code ENOTCACHED', 'npm error request failed'].join('\n'),
            error: 'npm error request failed', verdict: 'blocked'
        },
        {
            test: 'blocks when npm reports a peer conflict unrelated to the candidate',
            command: 'install', diagnostic: resolutionError('peer vite@"^7.0.0" from wrapper@1.0.0'),
            error: 'npm error ERESOLVE unable to resolve dependency tree', verdict: 'blocked'
        },
        {
            test: 'blocks when a candidate peer conflict lacks a successfully installed control',
            controlInstallFails: true, command: 'install', diagnostic: resolutionError(candidatePeer),
            error: `ERESOLVE: ${candidatePeer}`, verdict: 'blocked'
        }
    ];
    const consumerCases = [
        { ...grid, viewRecords: 1, verdict: 'passed', test: 'accepts one stable release in an npm view array' },
        ...[0, 2].map(viewRecords => ({
            ...grid, viewRecords, verdict: 'blocked',
            test: `blocks before packing when npm view returns ${viewRecords} stable releases`
        })),
        ...[core, grid].map(product => ({
            ...product, test: `blocks the ${product.name} candidate when the control lock drifts`,
            drift: true, verdict: 'blocked'
        })),
        ...peerCases.map(testCase => ({ ...grid, ...testCase })),
        {
            ...grid,
            nestedGrid: true,
            verdict: 'failed',
            test: 'fails when Grid Lite React resolves a separate Grid Lite installation'
        },
        {
            ...grid,
            installedDrift: true,
            failReplayWrite: true,
            verdict: 'failed',
            test: 'emits the known candidate failure when replay evidence cannot be written'
        },
        ...[core, grid, pro].flatMap(product => [
            {
                ...product,
                prepared: true,
                breakManifest: 'missing',
                verdict: 'blocked',
                test: `blocks ${product.name} before npm when its linked manifest is missing`
            },
            {
                ...product,
                prepared: true,
                breakManifest: 'wrong',
                verdict: 'blocked',
                test: `blocks ${product.name} before npm when its linked manifest changes`
            },
            {
                ...product,
                prepared: true,
                installedDrift: true,
                verdict: 'failed',
                test: `fails the first ${product.name} candidate install when npm's installed contents change`
            },
            {
                ...product,
                prepared: true,
                replayDrift: true,
                verdict: 'passed',
                test: `rejects a new file in the replayed ${product.name} installation`
            }
        ])
    ];
    for (const testCase of consumerCases) it(testCase.test, {
        skip: process.platform === 'win32'
    }, async () => {
        await withFixture(async root => {
            const {
                name, key, args, prepared, drift, command, diagnostic, error: expectedError, controlInstallFails,
                verdict, breakManifest, installedDrift, replayDrift, failReplayWrite, viewRecords, nestedGrid
            } = testCase;
            const directory = join(root, `${key}-package-prototype-prepared`);
            const tarball = prepared ? join(directory, 'candidate', 'candidate.tgz') : join(root, 'candidate.tgz');
            if (prepared) {
                await mkdir(join(directory, 'candidate'), { recursive: true });
            }
            const bytes = 'fixture tarball';
            const sha256 = createHash('sha256').update(bytes).digest('hex');
            const integrity = 'sha512-' + createHash('sha512').update(bytes).digest('base64');
            const npm = join(root, 'npm');
            await writeFile(tarball, bytes);
            const entry = key === 'highcharts' ? 'highcharts.js' : 'index.js';
            const contents = {
                [entry]: 'module.exports = {}',
                'package.json': JSON.stringify({
                    name, version: '13.1.1', main: entry, module: entry, types: entry
                })
            };
            if (key === 'highcharts') {
                for (const product of ['highstock', 'highmaps', 'highcharts-gantt']) {
                    contents[`${product}.js`] = contents[entry];
                    contents[`${product}.d.ts`] = 'export {};';
                }
                contents['es-modules/masters/highcharts.src.js'] = contents[entry];
            }
            if (prepared) {
                writeCandidateProvenance(directory, name, nightly, contents, '1');
                const path = join(directory, 'candidate',
                    key === 'highcharts' ? 'build-manifest.json' : 'staging-manifest.json');
                if (breakManifest === 'missing') {
                    await rm(path);
                } else if (breakManifest === 'wrong') {
                    await writeFile(path, '{}');
                }
            }
            const npmCalls = join(root, 'npm-calls');
            await writeFile(npm, `#!/usr/bin/env node
const fs = require('node:fs');
const { basename, dirname, join, resolve } = require('node:path');
const { pathToFileURL } = require('node:url');
const command = process.argv[2];
const lane = basename(process.cwd());
fs.appendFileSync(process.env.FIXTURE_NPM_CALLS, lane + ' ' + command + '\\n');
if (process.env.FIXTURE_REPLAY && ['view', 'pack', 'install'].includes(command)) {
    throw new Error('Replay must use retained inputs');
} else if (lane === 'candidate' && command === ${JSON.stringify(command)}) {
    console.error(${JSON.stringify(diagnostic)});
    process.exitCode = 1;
} else if (lane === 'control' && command === 'ci' && ${Boolean(controlInstallFails)}) {
    console.error('npm error setup failed');
    process.exitCode = 1;
} else if (command === 'view') {
    const stable = { version: '13.1.1', 'dist.integrity': '${integrity}' };
    const count = ${JSON.stringify(viewRecords)};
    console.log(JSON.stringify(count === undefined ? stable : Array.from({ length: count }, () => stable)));
} else if (command === 'pack') {
    fs.copyFileSync(process.env.FIXTURE_TARBALL, 'packed-control.tgz');
    console.log(JSON.stringify([{
        filename: 'packed-control.tgz', name: '${name}', version: '13.1.1', integrity: '${integrity}'
    }]));
} else if (command === '--version') {
    console.log('11.20.0');
} else if (command === 'install') {
    const lock = JSON.parse(fs.readFileSync('package-lock.json'));
    lock.packages['node_modules/${name}'].resolved = 'file:' + lane + '.tgz';
    lock.packages['node_modules/${name}'].integrity = '${integrity}';
    if (${Boolean(drift)}) {
        lock.packages['node_modules/unreviewed'] = { version: '1.0.0' };
    }
    fs.writeFileSync('package-lock.json', JSON.stringify(lock));
} else if (command === 'config') {
    console.log('false');
} else if (command === 'ci') {
    const installed = 'node_modules/${name}';
    for (const [name, bytes] of Object.entries(${JSON.stringify(contents)})) {
        const file = join(installed, name);
        fs.mkdirSync(dirname(file), { recursive: true });
        fs.writeFileSync(file, bytes);
    }
    const wrapper = join('node_modules', '@highcharts', '${key === 'grid-lite' ? 'grid-lite-react' : 'react'}');
    fs.mkdirSync(wrapper, { recursive: true });
    fs.writeFileSync(join(wrapper, 'index.js'), 'module.exports = {}');
    if (lane === 'candidate' && ${Boolean(nestedGrid)}) {
        const nestedEntry = join(wrapper, installed, '${entry}');
        fs.mkdirSync(dirname(nestedEntry), { recursive: true });
        fs.writeFileSync(nestedEntry, 'module.exports = {}');
    }
    if (lane === 'candidate' && ${Boolean(installedDrift)}) {
        fs.writeFileSync(join(installed, '${entry}'), 'Modified during installation');
    }
    if (lane === 'candidate' && ${Boolean(failReplayWrite)}) {
        fs.mkdirSync('../replay.json');
    }
    if (lane === 'candidate' && process.env.FIXTURE_REPLAY) {
        fs.writeFileSync(join(installed, 'generated.js'), 'Created during installation');
    }
} else if (command === 'test') {
    import(pathToFileURL(resolve('browser-cases.mjs'))).then(({ browserCases, consumerStartedAttachment }) => {
        const specs = browserCases.map(({ id }) => ({ title: id, tests: [{ results: [
            { status: 'passed', attachments: [{ name: consumerStartedAttachment }] }
        ] }] }));
        fs.writeFileSync('browser-results.json', JSON.stringify({ suites: [{ specs }] }));
    });
} else if (!['ls', 'run'].includes(command)) {
    process.exitCode = 1;
}
`);
            await chmod(npm, 0o755);
            const output = join(root, 'output');
            const input = prepared ? ['--prepared', directory] : [tarball];
            const options = {
                cwd: root,
                env: {
                    ...environment,
                    ...nightlyEnv,
                    TMPDIR: root,
                    PATH: root + delimiter + process.env.PATH,
                    FIXTURE_TARBALL: tarball,
                    FIXTURE_NPM_CALLS: npmCalls,
                    GITHUB_OUTPUT: output
                },
                stdio: 'pipe'
            };
            function invoke() {
                return execFileSync(process.execPath, [consumerRunner, ...input, sha256, ...args], options);
            }
            if (verdict === 'passed') {
                invoke();
            } else {
                throws(invoke, error => error.status === 1 &&
                    (!failReplayWrite || error.stderr?.includes('EISDIR')));
            }
            const evidence = (await readdir(root)).find(file =>
                file.startsWith(`${key}-package-prototype-`));
            const report = JSON.parse(readFileSync(join(root, evidence, 'results.json'), 'utf8'));
            strictEqual(report.verdict, verdict);
            strictEqual(report.provenance, prepared ? 'nightly' : 'tarball-only');
            if (prepared) {
                strictEqual(report.runId, nightly.runId);
                strictEqual(report.attempt, nightly.attempt);
                const [outputVerdict, results] = readFileSync(output, 'utf8').trim().split('\n');
                strictEqual(outputVerdict, `verdict=${verdict}`);
                deepEqual(JSON.parse(results.slice('results='.length)), report);
            } else {
                ok(!Object.hasOwn(report, 'runId'));
                ok(!Object.hasOwn(report, 'attempt'));
                ok(!existsSync(output));
            }
            if (breakManifest) {
                strictEqual(report.candidate.stage, 'candidate input');
                ok(report.candidate.error.includes(breakManifest === 'missing' ?
                    'Required package evidence unavailable' : 'Candidate manifest digest mismatch'));
                strictEqual(report.control.stage, 'not started');
                ok(!existsSync(npmCalls));
                ok(!existsSync(join(root, evidence, 'replay.json')));
                return;
            }
            if (viewRecords === 0 || viewRecords > 1) {
                strictEqual(report.control.outcome, 'blocked');
                strictEqual(report.control.stage, 'control input');
                strictEqual(report.control.error, 'Expected one stable release in npm view');
                strictEqual(report.candidate.outcome, 'blocked');
                strictEqual(report.candidate.error, 'Control baseline is unavailable');
                const calls = readFileSync(npmCalls, 'utf8').trim().split('\n');
                strictEqual(calls.length, 1);
                ok(calls[0].endsWith(' view'));
                return;
            }
            strictEqual(report.control.outcome, drift || controlInstallFails ? 'blocked' : 'passed');
            strictEqual(report.candidate.outcome, verdict);
            if (drift) {
                ok(report.control.error.includes('Unrelated lock drift'));
                ok(!existsSync(join(root, evidence, 'candidate', 'package-lock.json')));
            } else if (installedDrift) {
                strictEqual(report.candidate.stage, 'resolution');
                ok(report.candidate.error.includes(`Installed candidate file digest mismatch: ${entry}`));
            } else if (nestedGrid) {
                strictEqual(report.candidate.stage, 'resolution');
                ok(report.candidate.error.includes(
                    join('node_modules', '@highcharts/grid-lite-react', 'node_modules', name, entry)
                ));
            } else if (verdict !== 'passed') {
                strictEqual(report.candidate.stage, command === 'ci' ? 'install' : 'lock');
                strictEqual(report.candidate.error, expectedError);
            }
            const archives = (await readdir(join(root, evidence), { recursive: true }))
                .filter(path => path.endsWith('.tgz')).sort();
            deepEqual(archives, [join('candidate', 'candidate.tgz'), join('control', 'control.tgz')]);
            strictEqual(readFileSync(tarball, 'utf8'), bytes);
            if (replayDrift) {
                const replayScript = `
import { copyFixture, verifyReplaySource } from ${JSON.stringify(join(prototype, 'replay-evidence.mjs'))};
import { runConsumer } from ${JSON.stringify(consumerRunner)};
const root = ${JSON.stringify(directory)};
const fixture = ${JSON.stringify(join(root, 'reviewed-fixture'))};
const identity = ${JSON.stringify({ ...nightly, gridPackage: key === 'highcharts' ? undefined : key })};
copyFixture(${JSON.stringify(prototype)}, fixture, identity.gridPackage);
const selected = verifyReplaySource(root, fixture, identity);
process.exitCode = await runConsumer({ gridPackage: identity.gridPackage, replay: { root, fixture, ...selected } });
`;
                throws(() => execFileSync(process.execPath, ['--input-type=module', '-e', replayScript], {
                    ...options, env: { ...options.env, FIXTURE_REPLAY: 'true' }
                }), error => error.status === 1 &&
                    error.stdout?.includes('Installed candidate contains an unpacked file: generated.js'));
            }
        });
    });

    it('refuses to reuse a populated nightly evidence directory', async () => {
        await withFixture(async root => {
            await mkdir(join(root, 'candidate'));
            await writeFile(join(root, 'candidate', 'candidate.tgz'), 'candidate');
            const results = join(root, 'results.json');
            await writeFile(results, 'prior results');
            throws(() => execFileSync(process.execPath, [consumerRunner, '--prepared', root, '0'.repeat(64)], {
                stdio: 'pipe'
            }), error => error.status === 1 && error.stderr?.includes('Expected a fresh nightly evidence directory'));
            strictEqual(readFileSync(results, 'utf8'), 'prior results');
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
