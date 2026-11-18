import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
    appendFileSync, copyFileSync, cpSync, mkdirSync, mkdtempSync, readFileSync,
    realpathSync, statSync, writeFileSync
} from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
    fixtureFiles, hash, readJSON, recordReplay, verifyReplay, writeJSON
} from './replay-evidence.mjs';

const usage = 'Usage: node run.mjs <candidate.tgz> <expected-sha256> | --replay <retained-input-directory>';
const [tarball, expectedDigest, ...extra] = process.argv.slice(2);
if (tarball === '--help') {
    console.log(usage);
    process.exit(0);
}
const replay = tarball === '--replay' && expectedDigest ? resolve(expectedDigest) : undefined;
assert(!extra.length && (replay || (tarball && /^[a-f0-9]{64}$/u.test(expectedDigest))), usage);

const sourceFixture = fileURLToPath(new URL('.', import.meta.url));
const evidence = mkdtempSync(join(tmpdir(), 'highcharts-package-prototype-'));
const fixture = join(replay ?? evidence, 'fixture');
const env = { ...process.env, npm_config_cache: join(evidence, 'npm-cache') };
const installOptions = ['--strict-peer-deps', '--no-audit', '--no-fund'];
const results = {
    control: { outcome: 'blocked', stage: 'not started' },
    candidate: { outcome: 'blocked', stage: 'candidate input' }
};
let verifiedControlLock;
let verifiedCandidateLock;
let inspectBrowserResults;

function run(args, cwd, log, returnStatus = false) {
    console.log(`  npm ${args.join(' ')}`);
    const { stdout, stderr, status, error } = spawnSync('npm', args, {
        cwd, env, encoding: 'utf8'
    });
    writeFileSync(join(cwd, log), stdout ?? '');
    if (stderr) {
        writeFileSync(join(cwd, `${log}.stderr`), stderr);
    }
    if (error || status === null || (!returnStatus && status !== 0)) {
        const lines = [stdout, stderr].filter(Boolean).join('\n').split(/\r?\n/u);
        const actionableError = /\bError[:\]]|^npm error\s+(?!code\b|path\b|command\b|A complete log\b)/u;
        const detail = lines.find(line => /\berror TS\d+:/u.test(line)) ??
            lines.find(line => actionableError.test(line));
        throw new Error(detail?.trim().replaceAll(cwd + sep, '').slice(0, 500) ??
            error?.message ?? `npm ${args.join(' ')} failed with exit status ${status ?? 'unavailable'}`);
    }
    if (returnStatus) {
        return status;
    }
    return stdout;
}

function verifyLock(reference, current, path, integrity) {
    const { packages } = readJSON(current);
    const entry = packages['node_modules/highcharts'];
    assert.equal(entry?.resolved, `file:${path}`, 'Highcharts must resolve to the staged tarball');
    assert.equal(entry.integrity, integrity, 'Unexpected Highcharts lock integrity');

    // This fixture allows only the top-level Highcharts replacement. Review
    // any new package dependencies before extending this comparison.
    const baseline = readJSON(reference).packages;
    const withoutHighcharts = entries => Object.fromEntries(
        Object.entries(entries).filter(([key]) => key && key !== 'node_modules/highcharts')
    );
    assert.deepEqual(
        withoutHighcharts(packages), withoutHighcharts(baseline),
        'Unrelated lock drift or an unreviewed Highcharts dependency'
    );
}

function validate(label, archive, referenceLock) {
    const result = results[label];
    result.stage = 'lock';
    const cwd = join(evidence, label);
    mkdirSync(cwd);
    console.log(label);
    for (const file of fixtureFiles.filter(file => file !== 'package-lock.json')) {
        cpSync(join(fixture, file), join(cwd, file), { recursive: true });
    }
    const filename = `${label}.tgz`;
    const staged = join(cwd, filename);
    copyFileSync(archive, staged);
    const integrity = `sha512-${hash(staged, 'sha512', 'base64')}`;
    const manifest = join(cwd, 'package.json');
    const lock = join(cwd, 'package-lock.json');
    if (replay) {
        copyFileSync(join(replay, label, 'package.json'), manifest);
        copyFileSync(join(replay, label, 'package-lock.json'), lock);
    } else {
        const pkg = readJSON(manifest);
        pkg.dependencies.highcharts = `file:${filename}`;
        writeJSON(manifest, pkg);
        copyFileSync(referenceLock, lock);
        run(['install', '--package-lock-only', ...installOptions], cwd, 'lock.log');
    }
    verifyLock(referenceLock, lock, filename, integrity);
    if (label === 'control') {
        verifiedControlLock = lock;
    } else {
        verifiedCandidateLock = lock;
    }
    writeJSON(join(cwd, 'install-inputs.json'), {
        tarballSha256: hash(staged, 'sha256', 'hex'),
        manifestSha256: hash(manifest, 'sha256', 'hex'),
        lockSha256: hash(lock, 'sha256', 'hex')
    });
    result.stage = 'install';
    assert.equal(
        run(['config', 'get', 'ignore-scripts'], cwd, 'ignore-scripts.log').trim(),
        'false',
        'Use the fixture lifecycle policy for installation'
    );
    run(['ci', ...installOptions], cwd, 'install.log');

    result.stage = 'resolution';
    run(['ls', '--all', '--json'], cwd, 'dependency-tree.json');

    const require = createRequire(manifest);
    const wrapperRequire = createRequire(require.resolve('@highcharts/react'));
    const installed = join(cwd, 'node_modules/highcharts');
    assert.equal(realpathSync(installed), join(realpathSync(cwd), 'node_modules/highcharts'));
    for (const consumer of [require, wrapperRequire]) {
        assert.equal(consumer.resolve('highcharts'), join(realpathSync(installed), 'highcharts.js'));
    }
    const wrapperEntry = 'es-modules/masters/highcharts.src.js';
    assert.equal(
        wrapperRequire.resolve(`highcharts/${wrapperEntry}`),
        join(realpathSync(installed), wrapperEntry)
    );
    for (const entry of ['highstock', 'highmaps', 'highcharts-gantt']) {
        for (const extension of ['.js', '.d.ts']) {
            const file = join(installed, entry + extension);
            assert(statSync(file).size > 0, `Empty product entry: ${file}`);
        }
    }
    result.stage = 'types';
    run(['run', 'types'], cwd, 'types.log');
    result.stage = 'bundle';
    run(['run', 'build'], cwd, 'build.log');

    result.stage = 'browser';
    const status = run(['test'], cwd, 'browser.log', true);
    const reportPath = join(cwd, 'browser-results.json');
    let report;
    try {
        report = readJSON(reportPath);
    } catch (error) {
        throw new Error(`Browser report unavailable: ${error.code ?? error.name}`);
    }
    Object.assign(result, inspectBrowserResults(status, report));
}

function fetchControl() {
    const { version, 'dist.integrity': integrity } = JSON.parse(
        run(['view', 'highcharts@latest', 'version', 'dist.integrity', '--json'], evidence, 'latest.json')
    );
    assert(/^\d+\.\d+\.\d+$/u.test(version) && integrity, 'The latest tag must resolve to a stable release');
    const resolvedAt = new Date().toISOString();
    const [pack] = JSON.parse(run(['pack', `highcharts@${version}`, '--json'], evidence, 'control-pack.json'));
    const control = join(evidence, pack.filename);
    assert.equal(`sha512-${hash(control, 'sha512', 'base64')}`, integrity);
    writeJSON(join(evidence, 'inputs.json'), {
        candidate: { sha256: expectedDigest },
        control: { version, integrity, resolvedAt },
        node: process.version,
        npm: run(['--version'], evidence, 'npm-version.log').trim(),
        platform: process.platform,
        arch: process.arch
    });
    return control;
}

function validateLane(label, archive, lock) {
    try {
        validate(label, archive, lock);
    } catch (error) {
        const result = results[label];
        if (['resolution', 'types', 'bundle'].includes(result.stage)) {
            result.outcome = 'failed';
        }
        result.error = error.message;
    }
}

console.log(`Evidence: ${evidence}`);
const candidate = join(evidence, 'candidate.tgz');
let preparing = 'candidate';
try {
    let control;
    if (replay) {
        const { inputs } = verifyReplay(replay);
        assert.equal(process.version, inputs.node, 'Replay requires the recorded Node version');
        const npm = run(['--version'], evidence, 'npm-version.log').trim();
        assert.equal(npm, inputs.npm, 'Replay requires the recorded npm version');
        if (inputs.platform !== process.platform || inputs.arch !== process.arch) {
            console.warn(`Replay host differs from the original ${inputs.platform}/${inputs.arch} runner.`);
        }
        console.log(`Replaying recorded control Highcharts ${inputs.control.version} and both retained locks`);
        copyFileSync(join(replay, 'candidate', 'candidate.tgz'), candidate);
        control = join(replay, 'control', 'control.tgz');
    } else {
        copyFileSync(resolve(tarball), candidate);
        assert.equal(hash(candidate), expectedDigest, 'Candidate tarball digest mismatch');
        mkdirSync(fixture);
        for (const file of fixtureFiles) {
            cpSync(join(sourceFixture, file), join(fixture, file), { recursive: true });
        }
    }
    ({ inspectBrowserResults } = await import(pathToFileURL(join(fixture, 'browser-results.mjs'))));
    preparing = 'control';
    results.control.stage = 'control input';
    control ??= fetchControl();
    validateLane('control', control, join(fixture, 'package-lock.json'));
    if (verifiedControlLock) {
        validateLane('candidate', candidate, verifiedControlLock);
    } else {
        results.candidate.error = 'Control baseline did not pass lock verification';
    }
} catch (error) {
    results[preparing].error = error.message;
    if (preparing === 'control') {
        results.candidate.error = 'Control baseline is unavailable';
    }
}

const outcomes = Object.values(results).map(({ outcome }) => outcome);
const verdict = outcomes.includes('failed') ? 'failed' :
    outcomes.every(outcome => outcome === 'passed') ? 'passed' : 'blocked';
const report = { verdict, ...results };
console.log(JSON.stringify(report, null, 2));
writeJSON(join(evidence, 'results.json'), report);
if (!replay && verifiedControlLock && verifiedCandidateLock) {
    recordReplay(evidence);
}
if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `verdict=${verdict}\nresults=${JSON.stringify(report)}\n`);
}
process.exitCode = verdict === 'passed' ? 0 : 1;
