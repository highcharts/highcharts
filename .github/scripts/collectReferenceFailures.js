/* eslint-env node,es6 */

const { existsSync, readFileSync, writeFileSync, rmSync } = require('node:fs');
const usage = 'Usage: node .github/scripts/collectReferenceFailures.js [--log <path>] [--output <path>] [--reference-failed]';

function collectFailures(logPath, outputPath, referenceFailed) {
    let log = '';
    if (existsSync(logPath)) {
        log = readFileSync(logPath, 'utf8');
    }

    const failures = new Map();
    let terminalFailure = false;
    const blocks = log.split(/(?=^(?:Execution error|Browser error|Run error)\r?$)/m);
    for (const block of blocks) {
        const header = block.match(/^(Execution error|Browser error|Run error)\r?$/m);
        if (!header) {
            continue;
        }
        if (header[1] !== 'Execution error') {
            terminalFailure = true;
            continue;
        }
        const test = block.match(/^Test:\s*(.+)$/m);
        if (!test) {
            terminalFailure = true;
            continue;
        }
        const sample = test[1].match(/(?:^|\s)([^\s/]+\/[^\s/]+\/[^\s/]+)$/);
        if (sample) {
            failures.set(sample[1], block.split(/\r?\n/, 1)[0]);
        } else {
            terminalFailure = true;
        }
    }

    const entries = Array.from(failures, ([sample, error]) => ({ sample, error }))
        .sort((left, right) => left.sample.localeCompare(right.sample));
    if (entries.length) {
        writeFileSync(outputPath, `${JSON.stringify(entries, null, 2)}\n`);
    } else {
        rmSync(outputPath, { force: true });
    }

    if (terminalFailure || (referenceFailed && !entries.length)) {
        process.stderr.write(`::error::Reference run failed${terminalFailure ? ' with a terminal Karma error' : ' without a parsed per-sample failure'}\n`);
        return 1;
    }
    for (const entry of entries) {
        process.stdout.write(`::warning::Reference sample failed: ${entry.sample}\n`);
    }
    process.stdout.write(`Collected ${entries.length} reference sample failure(s).\n`);
    return 0;
}

function main(args) {
    let logPath = 'test/visual-test-errors.log';
    let outputPath = 'test/visual-reference-failures.json';
    let referenceFailed = false;
    for (let index = 0; index < args.length; index++) {
        if (args[index] === '--reference-failed') {
            referenceFailed = true;
        } else if (args[index] === '--log' && args[index + 1]) {
            logPath = args[++index];
        } else if (args[index] === '--output' && args[index + 1]) {
            outputPath = args[++index];
        } else {
            process.stderr.write(`${usage}\n`);
            return 1;
        }
    }
    return collectFailures(logPath, outputPath, referenceFailed);
}

if (require.main === module) {
    process.exitCode = main(process.argv.slice(2));
}

module.exports = { collectFailures, main };
