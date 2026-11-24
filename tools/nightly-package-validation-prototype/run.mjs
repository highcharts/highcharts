import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
    appendFileSync, copyFileSync, cpSync, existsSync, lstatSync, mkdirSync, mkdtempSync,
    readdirSync, readFileSync, realpathSync, renameSync, statSync, writeFileSync
} from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs, stripVTControlCharacters } from 'node:util';
import { readPackResult } from './npm-pack.mjs';
import {
    candidateFiles, hash, nightlyIdentity, readJSON, verifyCandidateEvidence,
    verifyInstalledCandidate, writeJSON
} from './package-evidence.mjs';
import {
    copyFixture, fixtureFiles, recordReplay
} from './replay-evidence.mjs';

class NpmPeerConflictError extends Error {}

function npmPeerConflict(lines, packageName) {
    const code = lines.findLastIndex(line => line.startsWith('npm error code '));
    if (lines[code] !== 'npm error code ERESOLVE') {
        return;
    }
    const conflict = lines.indexOf('npm error Could not resolve dependency:', code + 1);
    const peer = conflict < 0 ? undefined :
        /^npm error (?<requirement>peer(?:Optional)? (?<dependency>@?[^@\s]+)@.+ from (?<dependent>@?[^@\s]+)@\S+.*)$/u
            .exec(lines[conflict + 1])?.groups;
    if (peer && [peer.dependency, peer.dependent].includes(packageName)) {
        return `ERESOLVE: ${peer.requirement}`.slice(0, 500);
    }
}

export async function runConsumer({ tarball, expectedDigest, gridLite, replay, prepared }) {
    const sourceFixture = fileURLToPath(new URL('.', import.meta.url));
    const packageName = gridLite ? '@highcharts/grid-lite' : 'highcharts';
    const lockKey = `node_modules/${packageName}`;
    const evidence = prepared ?? mkdtempSync(join(tmpdir(), gridLite ? 'grid-lite-package-prototype-' : 'highcharts-package-prototype-'));
    const fixture = join(evidence, 'fixture');
    const candidate = join(evidence, 'candidate', 'candidate.tgz');
    const control = join(evidence, 'control', 'control.tgz');
    const provenance = prepared ? 'nightly' : replay?.inputs.candidate.provenance ?? 'tarball-only';
    const identity = prepared ? nightlyIdentity() : replay?.manifest;
    if (prepared) {
        assert(lstatSync(evidence).isDirectory() && lstatSync(join(evidence, 'candidate')).isDirectory() &&
            lstatSync(candidate).isFile(), 'Expected a prepared candidate tarball');
        assert.deepEqual(readdirSync(evidence), ['candidate'], 'Expected a fresh nightly evidence directory');
    }
    mkdirSync(join(evidence, 'control'));
    const env = replay ? { ...process.env, npm_config_offline: 'true' } :
        { ...process.env, npm_config_cache: join(evidence, 'npm-cache') };
    const installOptions = ['--strict-peer-deps', '--no-audit', '--no-fund'];
    const results = {
        control: { outcome: 'blocked', stage: 'not started' },
        candidate: { outcome: 'blocked', stage: 'candidate input' }
    };
    let verifiedControlLock;
    let verifiedCandidateLock;
    let controlInstalled = false;
    let inspectBrowserResults;
    let candidateEvidence;

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
            const stderrLines = stripVTControlCharacters(stderr ?? '').split(/\r?\n/u);
            const peerConflict = !error && status > 0 && ['install', 'ci'].includes(args[0]) &&
                npmPeerConflict(stderrLines, packageName);
            if (peerConflict) {
                throw new NpmPeerConflictError(peerConflict);
            }
            const lines = [
                ...stripVTControlCharacters(stdout ?? '').split(/\r?\n/u), ...stderrLines
            ];
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

    function validate(label, referenceLock) {
        const result = results[label];
        result.stage = 'lock';
        const cwd = join(evidence, label);
        console.log(label);
        for (const file of fixtureFiles.filter(file => file !== 'package-lock.json')) {
            cpSync(join(fixture, file), join(cwd, file), { recursive: true });
        }
        const filename = `${label}.tgz`;
        const staged = join(cwd, filename);
        const integrity = `sha512-${hash(staged, 'sha512', 'base64')}`;
        const manifest = join(cwd, 'package.json');
        const lock = join(cwd, 'package-lock.json');
        if (replay) {
            copyFileSync(join(replay.root, label, 'package.json'), manifest);
            copyFileSync(join(replay.root, label, 'package-lock.json'), lock);
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
            lockSha256: hash(lock, 'sha256', 'hex'),
            provenanceSha256: label === 'candidate' ? candidateEvidence?.provenanceSha256 : undefined
        });
        result.stage = 'install';
        assert.equal(
            run(['config', 'get', 'ignore-scripts'], cwd, 'ignore-scripts.log').trim(),
            'false',
            'Use the fixture lifecycle policy for installation'
        );
        run(['ci', ...installOptions], cwd, 'install.log');
        if (label === 'control') {
            controlInstalled = true;
        }

        result.stage = 'resolution';
        run(['ls', '--all', '--json'], cwd, 'dependency-tree.json');

        const installed = join(realpathSync(cwd), lockKey);
        assert.equal(realpathSync(installed), installed);
        if (label === 'candidate' && candidateEvidence) {
            verifyInstalledCandidate(installed, candidateEvidence);
        }
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
        if (replay && status !== 0) {
            console.error(`${label} browser log:\n${readFileSync(join(cwd, 'browser.log'), 'utf8').slice(-24_000)}`);
        }
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
        const wrapperRequire = createRequire(require.resolve('@highcharts/grid-lite-react'));
        assert.equal(wrapperRequire.resolve(packageName), resolve(installed, pkg.main));
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
        const response = JSON.parse(
            run(['view', `${packageName}@latest`, 'version', 'dist.integrity', '--json'], evidence, 'latest.json')
        );
        // npm 11 returns an object for one release. npm 12 returns an array.
        const releases = Array.isArray(response) ? response : [response];
        assert(releases.length === 1, 'Expected one stable release in npm view');
        const { version, 'dist.integrity': integrity } = releases[0] ?? {};
        assert(typeof version === 'string' && /^\d+\.\d+\.\d+$/u.test(version) &&
            typeof integrity === 'string' && integrity, 'The latest tag must resolve to a stable release');
        const resolvedAt = new Date().toISOString();
        const pack = readPackResult(run(['pack', `${packageName}@${version}`, '--json'], evidence,
            'control-pack.json'), packageName);
        renameSync(join(evidence, pack.filename), control);
        assert.equal(pack.integrity, integrity, 'Stable control pack integrity differs from the registry');
        assert.equal(`sha512-${hash(control, 'sha512', 'base64')}`, integrity);
        writeJSON(join(evidence, 'inputs.json'), {
            packageName,
            candidate: { sha256: expectedDigest, provenance, provenanceSha256: candidateEvidence?.provenanceSha256 },
            control: { version, integrity, resolvedAt },
            node: process.version,
            npm: run(['--version'], evidence, 'npm-version.log').trim(),
            platform: process.platform,
            arch: process.arch
        });
    }

    function validateLane(label, lock) {
        try {
            validate(label, lock);
        } catch (error) {
            const result = results[label];
            if (['resolution', 'types', 'bundle'].includes(result.stage) ||
                (label === 'candidate' && controlInstalled && error instanceof NpmPeerConflictError)) {
                result.outcome = 'failed';
            }
            result.error = error.message;
        }
    }

    console.log(`Evidence: ${evidence}`);
    let preparing = 'candidate';
    try {
        if (!prepared) {
            mkdirSync(join(evidence, 'candidate'));
            copyFileSync(replay ? join(replay.root, 'candidate', 'candidate.tgz') : resolve(tarball), candidate);
        }
        if (provenance === 'nightly') {
            const records = candidateFiles(packageName, provenance);
            if (replay) {
                for (const name of records) {
                    copyFileSync(join(replay.root, name), join(evidence, name));
                }
            } else {
                const expected = new Set(['candidate.tgz', ...records.map(name => name.slice('candidate/'.length))]);
                assert(readdirSync(join(evidence, 'candidate')).every(name => expected.has(name)),
                    'Unexpected file in the prepared candidate directory');
            }
            candidateEvidence = verifyCandidateEvidence(evidence, packageName,
                identity, replay ? replay.inputs.candidate.sha256 : expectedDigest);
        } else {
            assert.equal(hash(candidate), replay ? replay.inputs.candidate.sha256 : expectedDigest,
                'Candidate tarball digest mismatch');
        }
        if (replay) {
            const { inputs } = replay;
            assert.equal(inputs.packageName, packageName, 'Replay package mismatch');
            assert.equal(process.version, inputs.node, 'Replay requires the recorded Node version');
            const npm = run(['--version'], evidence, 'npm-version.log').trim();
            assert.equal(npm, inputs.npm, 'Replay requires the recorded npm version');
            if (inputs.platform !== process.platform || inputs.arch !== process.arch) {
                console.warn(`Replay host differs from the original ${inputs.platform}/${inputs.arch} runner.`);
            }
            console.log(`Replaying recorded control ${packageName} ${inputs.control.version} and both retained locks`);
        }
        copyFixture(replay ? replay.fixture : sourceFixture, fixture, gridLite && !replay);
        ({ inspectBrowserResults } = await import(pathToFileURL(join(fixture, 'browser-results.mjs'))));
        preparing = 'control';
        results.control.stage = 'control input';
        if (replay) {
            copyFileSync(join(replay.root, 'control', 'control.tgz'), control);
        } else {
            fetchControl();
        }
        validateLane('control', join(fixture, 'package-lock.json'));
        if (verifiedControlLock) {
            validateLane('candidate', verifiedControlLock);
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
    const report = {
        verdict,
        provenance,
        runId: identity?.runId,
        attempt: identity?.attempt,
        ...results
    };
    console.log(JSON.stringify(report, null, 2));
    if (prepared && process.env.GITHUB_OUTPUT) {
        appendFileSync(process.env.GITHUB_OUTPUT, `verdict=${verdict}\nresults=${JSON.stringify(report)}\n`);
    }
    writeJSON(join(evidence, 'results.json'), report);
    if (!replay && verifiedControlLock && verifiedCandidateLock) {
        recordReplay(evidence, identity ?? {
            sourceSha: spawnSync('git', ['-C', sourceFixture, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout?.trim()
        });
    }
    return verdict === 'passed' ? 0 : 1;
}

const isMain = import.meta.main ?? (
    process.argv[1] && existsSync(process.argv[1]) &&
    realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))
);
if (isMain) {
    const usage = 'Usage: node run.mjs <candidate.tgz> <expected-sha256> | --prepared <nightly-evidence-directory> <expected-sha256> | --replay <retained-input-directory> [--package grid-lite]';
    const args = process.argv.slice(2);
    const prepared = args[0] === '--prepared';
    const [tarball, expectedDigest, ...extra] = prepared ? args.slice(1) : args;
    if (tarball === '--help') {
        console.log(usage);
    } else {
        try {
            const { values } = parseArgs({ args: extra, options: {
                package: { type: 'string' }
            } });
            const gridLite = values.package === 'grid-lite';
            assert(values.package === undefined || gridLite, usage);
            if (!prepared && tarball === '--replay' && expectedDigest) {
                const { runReplay } = await import('./replay-isolation.mjs');
                process.exitCode = runReplay({ evidence: resolve(expectedDigest), gridLite });
            } else {
                assert(tarball && /^[a-f0-9]{64}$/u.test(expectedDigest), usage);
                process.exitCode = await runConsumer({
                    tarball, expectedDigest, gridLite, prepared: prepared ? resolve(tarball) : undefined
                });
            }
        } catch (error) {
            console.error(error.message);
            process.exitCode = 1;
        }
    }
}
