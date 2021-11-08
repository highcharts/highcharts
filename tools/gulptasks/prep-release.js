/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');
const packageJson = require('../../package.json');
const ChildProcess = require('child_process');
const LogLib = require('./lib/log');
const fs = require('fs');

/**
 * Prepares a new release by replacing version numbers with the supplied version. Replaces version numbers in
 * package.json, bower.json, build-properties.json and replaces any "@ since next" tag in docs with the specified --nextversion
 * Run using `gulp prep-release --nextversion` and `gulp prep-release --cleanup (--commit)`.
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

        if (packageJsonVersion !== bowerJsonVersion ||
            packageJsonVersion !== buildPropsVersion.replace('-modified', '') ||
            buildPropsVersion.replace('-modified', '') !== bowerJsonVersion) {
            LogLib.warn('The current versions declared in files package.json, ' +
                                'bower.json and build-properties.json does not match!');
        }

        if (argv.cleanup) {
            const stagedChanges = ChildProcess.execSync('git diff --cached --name-only').toString();
            buildProperties.version = packageJsonVersion + '-modified';
            buildProperties.date = '';
            fs.writeFileSync('build-properties.json', JSON.stringify(buildProperties, null, 2));

            if (argv.commit) {
                if (stagedChanges) {
                    reject(new Error('You have other staged changes. Please commit or remove them first.'));
                    return;
                }
                ChildProcess.execSync(`git add build-properties.json && git commit -m"Cleaned up after v${packageJsonVersion}."`);
                LogLib.message('Clean up commit added. git push when you are ready.');
            }
            LogLib.success(`Cleaned up after v${packageJsonVersion}`);
            resolve();
            return;
        }

        LogLib.message('Preparing version number update. Current version is ' + packageJsonVersion);

        const nextVersion = argv.nextversion;
        if (!argv.cleanup && !nextVersion) {
            reject(new Error('Please provide either --nextversion x.y.z or --cleanup when starting the command.'));
            return;
        }
        if (nextVersion && !/^[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2}$/.test(nextVersion)) {
            reject(new Error('--nextversion must be on the form x.x.x'));
            return;
        }
        /*
            Replace version in relevant files (ideally all current versions should be equal, but since they
            sometimes have proven not to be, we make sure to replace the existing version in the exact file
            with the next version
        */
        ChildProcess.execSync(`sed -i'.bak' -e '/version/s/"${packageJsonVersion}"/'\\"${nextVersion}\\"/ package.json`);
        ChildProcess.execSync(`sed -i'.bak' -e '/version/s/"${bowerJsonVersion}"/'\\"${nextVersion}\\"/ bower.json`);

        // Update build-properties.json
        buildProperties.version = nextVersion;
        buildProperties.date = new Date().toISOString().split('T')[0];
        fs.writeFileSync('build-properties.json', JSON.stringify(buildProperties, null, 2));

        // replace occurences of @ since next in docs with @since x.y.z, first checking if xargs is on gnu (linux) or bsd (osx).
        const isGNU = ChildProcess.execSync('xargs --version 2>&1 |grep -s GNU >/dev/null && echo true || echo false').toString().replace('\n', '') === 'true';
        ChildProcess.execSync(`grep -Rl --exclude=*.bak --exclude-dir=node_modules --exclude-dir=code "@since\\s\\+next" . | xargs ${isGNU ? '-r' : ''} sed -i'.bak' -e 's/@since *next/@since ${nextVersion}/'`);

        LogLib.success('Updated version in package.json, bower.json, build-properties.json and replaced @ since next' +
                        ' in the docs. Please review changes and commit & push when ready.');
        resolve();
    });
}

prepareRelease.description = 'Prepares a new release by replacing version numbers with the supplied version. ' +
                                'Replaces version numbers in package.json, bower.json, build-properties.json and ' +
                                'replaces any "@ since next" tag in docs with the specified nextversion';
prepareRelease.flags = {
    '--cleanup': 'Will add -modified to version and remove date from build-properties.json. Exludes --version',
    '--commit': 'Commit cleanup changes. Implies --cleanup.',
    '--nextversion': 'Version that will replace version in package.json, build-properties.json, bower.json and "since next" in the docs.'
};

Gulp.task('prep-release', prepareRelease);
