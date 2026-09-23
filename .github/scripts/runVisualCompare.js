/* eslint-env node,es6 */

const { spawnSync } = require('node:child_process');
const { existsSync, rmSync, appendFileSync } = require('node:fs');

const completionMarker = 'test/visual-test-complete';
const errorLog = 'test/visual-test-errors.log';
const karma = require.resolve('karma/bin/karma');
const usage = 'Usage: node .github/scripts/runVisualCompare.js <product> <tests-glob>';

/**
 * Runs one candidate visual comparison and records incomplete runs.
 *
 * @param {string} product Human-readable product name.
 * @param {string} testsGlob Tests glob passed to Karma.
 * @param {Object} [options] Test-only path and child runner overrides.
 * @param {string} [options.completionPath] Completion marker path.
 * @param {string} [options.errorPath] Execution error log path.
 * @param {Function} [options.runChild] Child process runner.
 * @return {number} Zero so visual test execution can continue after Karma errors.
 */
function runVisualCompare(product, testsGlob, options = {}) {
    const {
        completionPath = completionMarker,
        errorPath = errorLog,
        runChild = spawnSync
    } = options;
    const args = [
        karma,
        'start',
        'test/karma-conf.js',
        '--tests',
        testsGlob,
        '--ts',
        '--single-run',
        '--browsercount',
        '2',
        '--visualcompare'
    ];

    rmSync(completionPath, { force: true });
    try {
        runChild(process.execPath, args, { stdio: 'inherit' });
    } catch {
        // A missing marker below records spawn failures in the existing log.
    }

    if (!existsSync(completionPath)) {
        appendFileSync(
            errorPath,
            `${product} candidate run did not reach image-capture reporter completion.\n`
        );
    }

    return 0;
}

function main(args) {
    if (args.length !== 2 || args.some(arg => !arg)) {
        process.stderr.write(`${usage}\n`);
        return 1;
    }
    return runVisualCompare(args[0], args[1]);
}

if (require.main === module) {
    process.exitCode = main(process.argv.slice(2));
}

module.exports = { main, runVisualCompare };
