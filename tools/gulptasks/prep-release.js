/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');
const packageJson = require('../../package.json');
const ChildProcess = require('child_process');
const LogLib = require('../libs/log');
const fs = require('fs');
const semver = require('semver');

/**
 * Replace the first since/deprecated tag on each line, as in the release task.
 * @param {string} directory Directory to search without following symlinks.
 * @param {string} version Validated release version.
 */
function replaceNextTags(directory, version) {
    let files;
    try {
        files = ChildProcess.execFileSync('grep', [
            '-rl', '--null',
            '--exclude=*.bak', '--exclude=*.md',
            '--exclude-dir=node_modules', '--exclude-dir=code',
            '-e', '@since[[:space:]][[:space:]]*next',
            '-e', '@deprecated[[:space:]][[:space:]]*next', directory
        ], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }).split('\0').filter(Boolean);
    } catch (error) {
        if (error.status === 1) {
            return; // No matching doclets.
        }
        throw error;
    }
    // The space preserves regex backslashes when invoked through Windows/MSYS.
    const script =
        `s/@since\\([[:space:]][[:space:]]*\\)next/@since\\1${version}/; ` +
        `s/@deprecated\\([[:space:]][[:space:]]*\\)next/@deprecated\\1${version}/`;
    for (let index = 0; index < files.length; index += 50) {
        ChildProcess.execFileSync('sed', [
            '-i.bak', '-e', script, ...files.slice(index, index + 50)
        ]);
    }
}

/**
 * Prepares a new release by replacing version numbers with the supplied
 * version. Replaces version numbers in package.json, bower.json,
 * build-properties.json. For plain x.y.z versions, also replaces pending
 * "since" and "deprecated" doclet tags with the specified --nextversion.
 *
 * Run using `gulp prep-release --nextversion` and
 * `gulp prep-release --cleanup (--commit)`.
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function prepareRelease() {
    const argv = require('yargs').argv;

    return new Promise((resolve, reject) => {
        const packageJsonVersion = packageJson.version;
        const bowerJsonVersion = require('../../bower.json').version;
        const buildProperties = require('../../build-properties.json');
        const buildPropsVersion = buildProperties.version;

        LogLib.message(`Versions before applying next version are:\n
            package.json: ${packageJsonVersion}
            bower.json: ${bowerJsonVersion}
            build-properties.json: ${buildPropsVersion}
        `);

        if (
            packageJsonVersion !== bowerJsonVersion ||
            packageJsonVersion !== buildPropsVersion.replace('-modified', '') ||
            buildPropsVersion.replace('-modified', '') !== bowerJsonVersion
        ) {
            LogLib.warn(
                'The current versions declared in files package.json, ' +
                'bower.json and build-properties.json does not match!'
            );
        }

        if (argv.cleanup) {
            const stagedChanges = ChildProcess.execFileSync(
                'git', ['diff', '--cached', '--name-only']
            ).toString();
            buildProperties.version = packageJsonVersion + '-modified';
            buildProperties.date = '';
            fs.writeFileSync(
                'build-properties.json',
                JSON.stringify(buildProperties, null, 2)
            );

            if (argv.commit) {
                if (stagedChanges) {
                    reject(new Error(
                        'You have other staged changes.' +
                        ' Please commit or remove them first.'
                    ));
                    return;
                }
                ChildProcess.execFileSync('git', ['add', 'build-properties.json']);
                ChildProcess.execFileSync('git', [
                    'commit', '-m', `Cleaned up after v${packageJsonVersion}.`
                ]);
                LogLib.message(
                    'Clean up commit added. git push when you are ready.'
                );
            }
            LogLib.success(`Cleaned up after v${packageJsonVersion}`);
            resolve();
            return;
        }

        LogLib.message('Preparing version number update. Current version is ' +
            packageJsonVersion);

        const nextVersion = argv.nextversion;
        if (!argv.cleanup && !nextVersion) {
            reject(new Error('Please provide either --nextversion x.y.z or' +
                ' --cleanup when starting the command.'));
            return;
        }
        const parsed = typeof nextVersion === 'string' && semver.parse(nextVersion);
        const canonical = parsed && parsed.version +
            (parsed.build.length ? '+' + parsed.build.join('.') : '');
        if (!parsed || canonical !== nextVersion) {
            reject(new Error('--nextversion must be a complete semantic version'));
            return;
        }

        // Replace version in relevant files (ideally all current versions
        // should be equal, but since they sometimes have proven not to be,
        // we make sure to replace the existing version in the exact file
        // with the next version
        for (const file of ['package.json', 'bower.json']) {
            ChildProcess.execFileSync('sed', [
                '-i.bak', '-e',
                `s/\\("version"[[:space:]]*:[[:space:]]*"\\)[^"]*/\\1${nextVersion}/`,
                file
            ]);
        }

        // Update build-properties.json
        buildProperties.version = nextVersion;
        buildProperties.date = new Date().toISOString().split('T')[0];
        fs.writeFileSync(
            'build-properties.json',
            JSON.stringify(buildProperties, null, 2)
        );

        const updateDoclets = !parsed.prerelease.length && !parsed.build.length;
        if (updateDoclets) {
            replaceNextTags('.', nextVersion);
        }

        LogLib.success(
            'Updated version in package.json, bower.json and' +
            ' build-properties.json. ' +
            (updateDoclets ?
                'Replaced pending since/deprecated doclet tags. ' :
                'Preserved doclet tags for the suffixed version. ') +
            'Please review changes and commit & push when ready.'
        );
        resolve();
    });
}

prepareRelease.description = 'Prepares a new release by replacing version' +
    ' numbers with the supplied version. Replaces version numbers in' +
    ' package.json, bower.json and build-properties.json. Only plain x.y.z' +
    ' versions replace "next" in "since" and "deprecated" doclet tags.';
prepareRelease.flags = {
    '--cleanup': 'Will add -modified to version and remove date from' +
        ' build-properties.json. Exludes --version',
    '--commit': 'Commit cleanup changes. Implies --cleanup.',
    '--nextversion': 'Version that will replace version in package.json,' +
        ' build-properties.json and bower.json. Only plain x.y.z versions' +
        ' replace "next" in "since" and "deprecated" doclet tags.'
};

Gulp.task('prep-release', prepareRelease);
