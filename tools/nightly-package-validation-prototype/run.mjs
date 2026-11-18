import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
    appendFileSync, copyFileSync, cpSync, mkdirSync, mkdtempSync, readFileSync,
    realpathSync, statSync, writeFileSync
} from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const usage = 'Usage: node run.mjs <candidate.tgz> <expected-sha256>';
const [tarball, expectedDigest, ...extra] = process.argv.slice(2);
if (tarball === '--help') {
    console.log(usage);
    process.exit(0);
}
assert(tarball && /^[a-f0-9]{64}$/u.test(expectedDigest) && !extra.length, usage);

const fixture = fileURLToPath(new URL('.', import.meta.url));
const evidence = mkdtempSync(join(tmpdir(), 'highcharts-package-prototype-'));
const env = { ...process.env, npm_config_cache: join(evidence, 'npm-cache') };
const installOptions = ['--strict-peer-deps', '--no-audit', '--no-fund'];
const results = {
    control: { outcome: 'blocked', stage: 'control input' },
    candidate: { outcome: 'blocked', stage: 'candidate input' }
};
let verifiedControlLock;

function hash(path, algorithm, encoding) {
    return createHash(algorithm).update(readFileSync(path)).digest(encoding);
}

function readJSON(path) {
    return JSON.parse(readFileSync(path, 'utf8'));
}

function writeJSON(path, value) {
    writeFileSync(path, JSON.stringify(value, null, 2) + '\n');
}

function run(args, cwd, log, returnStatus = false) {
    console.log(`  npm ${args.join(' ')}`);
    const { stdout, stderr, status, error } = spawnSync('npm', args, {
        cwd, env, encoding: 'utf8'
    });
    writeFileSync(join(cwd, log), stdout ?? '');
    if (stderr) {
        writeFileSync(join(cwd, `${log}.stderr`), stderr);
    }
    assert(
        !error && status !== null && (returnStatus || status === 0),
        `npm ${args.join(' ')} failed. See ${join(cwd, log)}`
    );
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
    for (const file of [
        'app', 'consumer.spec.mjs', 'package.json', 'playwright.config.mjs',
        'tsconfig.json', 'vite.config.mjs'
    ]) {
        cpSync(join(fixture, file), join(cwd, file), { recursive: true });
    }
    const filename = `${label}.tgz`;
    const staged = join(cwd, filename);
    copyFileSync(archive, staged);
    const integrity = `sha512-${hash(staged, 'sha512', 'base64')}`;
    const manifest = join(cwd, 'package.json');
    const lock = join(cwd, 'package-lock.json');
    const pkg = readJSON(manifest);
    pkg.dependencies.highcharts = `file:${filename}`;
    writeJSON(manifest, pkg);
    copyFileSync(referenceLock, lock);
    run(['install', '--package-lock-only', ...installOptions], cwd, 'lock.log');
    verifyLock(referenceLock, lock, filename, integrity);
    if (label === 'control') {
        verifiedControlLock = lock;
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
    const { errors, stats, suites } = readJSON(join(cwd, 'browser-results.json'));
    const checks = suites.flatMap(suite => suite.specs)
        .flatMap(spec => spec.tests)
        .flatMap(test => test.results)
        .filter(run => run.attachments.some(({ name }) => name === 'consumer-check-started'));
    if (checks.some(({ status }) => status === 'failed' || status === 'timedOut')) {
        result.outcome = 'failed';
        throw new Error(`Chromium consumer assertion failed. See ${join(cwd, 'browser.log')}`);
    }
    assert(
        status === 0 && errors.length === 0 && checks.length === 2 &&
        stats.expected === 2 && stats.skipped === 0 && stats.unexpected === 0 && stats.flaky === 0,
        `Chromium consumer checks did not complete. See ${join(cwd, 'browser.log')}`
    );
    result.outcome = 'passed';
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
    copyFileSync(resolve(tarball), candidate);
    assert.equal(hash(candidate, 'sha256', 'hex'), expectedDigest, 'Candidate tarball digest mismatch');
    results.candidate.stage = 'lock';
    preparing = 'control';
    const control = fetchControl();
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
if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `verdict=${verdict}\n`);
}
process.exitCode = verdict === 'passed' ? 0 : 1;
