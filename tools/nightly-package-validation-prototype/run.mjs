import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
    appendFileSync, copyFileSync, cpSync, mkdirSync, mkdtempSync, readFileSync,
    realpathSync, statSync, writeFileSync
} from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { stripVTControlCharacters } from 'node:util';
import {
    fixtureFiles, hash, readJSON, recordReplay, verifyReplay, writeJSON
} from './replay-evidence.mjs';

const usage = 'Usage: node run.mjs <candidate.tgz> <expected-sha256> [--package grid-lite] | --replay <retained-input-directory> [--package grid-lite]';
const [tarball, expectedDigest, ...extra] = process.argv.slice(2);
if (tarball === '--help') {
    console.log(usage);
    process.exit(0);
}
const replay = tarball === '--replay' && expectedDigest ? resolve(expectedDigest) : undefined;
const gridLite = extra.length === 2 && extra[0] === '--package' && extra[1] === 'grid-lite';
assert((!extra.length || gridLite) && (replay || (tarball && /^[a-f0-9]{64}$/u.test(expectedDigest))), usage);

const sourceFixture = fileURLToPath(new URL('.', import.meta.url));
const packageName = gridLite ? '@highcharts/grid-lite' : 'highcharts';
const lockKey = `node_modules/${packageName}`;
const productFiles = ['app', 'browser-cases.mjs', 'package-lock.json', 'package.json', 'tsconfig.json'];
const evidence = mkdtempSync(join(tmpdir(), gridLite ? 'grid-lite-package-prototype-' : 'highcharts-package-prototype-'));
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
        const lines = stripVTControlCharacters([stdout, stderr].filter(Boolean).join('\n')).split(/\r?\n/u);
        const actionableError = /\b\w*Error[:\]]|^npm error\s+(?!code\b|path\b|command\b|A complete log\b)/u;
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
    const entry = packages[lockKey];
    assert.equal(entry?.resolved, `file:${path}`, `${packageName} must resolve to the staged tarball`);
    assert.equal(entry.integrity, integrity, `Unexpected ${packageName} lock integrity`);

    const baseline = readJSON(reference).packages;
    const otherDependencies = entries => Object.fromEntries(
        Object.entries(entries).filter(([key]) => key && key !== lockKey)
    );
    assert.deepEqual(
        otherDependencies(packages), otherDependencies(baseline),
        `Unrelated lock drift or an unreviewed ${packageName} dependency`
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
        pkg.dependencies[packageName] = `file:${filename}`;
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

    const installed = join(realpathSync(cwd), lockKey);
    assert.equal(realpathSync(installed), installed);
    if (gridLite) {
        verifyGridLiteEntries(manifest, installed);
    } else {
        verifyHighchartsEntries(manifest, installed);
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

function verifyGridLiteEntries(manifest, installed) {
    const require = createRequire(manifest);
    const pkg = readJSON(join(installed, 'package.json'));
    assert.equal(pkg.name, packageName);
    for (const field of ['main', 'module', 'types']) {
        assert(typeof pkg[field] === 'string' && pkg[field], `Missing Grid Lite ${field} entry`);
        const file = realpathSync(resolve(installed, pkg[field]));
        const path = relative(installed, file);
        assert(path && !path.startsWith(`..${sep}`) && path !== '..' && !isAbsolute(path) &&
            statSync(file).isFile() && statSync(file).size > 0, `Invalid Grid Lite ${field} entry`);
    }
    assert.equal(require.resolve(packageName), resolve(installed, pkg.main));
}

function verifyHighchartsEntries(manifest, installed) {
    const require = createRequire(manifest);
    const wrapperRequire = createRequire(require.resolve('@highcharts/react'));
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
}

function fetchControl() {
    const { version, 'dist.integrity': integrity } = JSON.parse(
        run(['view', `${packageName}@latest`, 'version', 'dist.integrity', '--json'], evidence, 'latest.json')
    );
    assert(/^\d+\.\d+\.\d+$/u.test(version) && integrity, 'The latest tag must resolve to a stable release');
    const resolvedAt = new Date().toISOString();
    const [pack] = JSON.parse(run(['pack', `${packageName}@${version}`, '--json'], evidence, 'control-pack.json'));
    const control = join(evidence, pack.filename);
    assert.equal(`sha512-${hash(control, 'sha512', 'base64')}`, integrity);
    writeJSON(join(evidence, 'inputs.json'), {
        packageName,
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
        assert.equal(inputs.packageName ?? 'highcharts', packageName, 'Replay package mismatch');
        assert.equal(process.version, inputs.node, 'Replay requires the recorded Node version');
        const npm = run(['--version'], evidence, 'npm-version.log').trim();
        assert.equal(npm, inputs.npm, 'Replay requires the recorded npm version');
        if (inputs.platform !== process.platform || inputs.arch !== process.arch) {
            console.warn(`Replay host differs from the original ${inputs.platform}/${inputs.arch} runner.`);
        }
        console.log(`Replaying recorded control ${packageName} ${inputs.control.version} and both retained locks`);
        copyFileSync(join(replay, 'candidate', 'candidate.tgz'), candidate);
        control = join(replay, 'control', 'control.tgz');
    } else {
        copyFileSync(resolve(tarball), candidate);
        assert.equal(hash(candidate), expectedDigest, 'Candidate tarball digest mismatch');
        mkdirSync(fixture);
        for (const file of fixtureFiles) {
            const directory = gridLite && productFiles.includes(file) ? join(sourceFixture, 'grid-lite') : sourceFixture;
            cpSync(join(directory, file), join(fixture, file), { recursive: true });
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
