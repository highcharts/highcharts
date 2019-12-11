/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');
const packageJson = require('../../package.json');
const ChildProcess = require('child_process');
const LogLib = require('./lib/log');
const getBuildProperties = require('./lib/build').getBuildProperties;

/**
 * Prepares a new release by replacing version numbers with the supplied version. Replaces version numbers in
 * package.json, bower.json, build.properties and replaces any "@ since next" tag in docs with the specified --nextversion
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
        const buildProperties = getBuildProperties();
        const buildPropsVersion = buildProperties.highcharts.product.version;

        LogLib.message(`Versions before applying next version are:\n
            package.json: ${packageJsonVersion}
            bower.json: ${bowerJsonVersion}
            build.properties: ${buildPropsVersion}
        `);

        if (packageJsonVersion !== bowerJsonVersion ||
            packageJsonVersion !== buildPropsVersion ||
            buildPropsVersion !== bowerJsonVersion) {
            LogLib.warn('The current versions declared in files package.json, ' +
                                'bower.json and build.properties does not match!');
        }

        if (argv.cleanup) {
            const stagedChanges = ChildProcess.execSync('git diff --cached --name-only').toString();
            ChildProcess.execSync(`sed -i s/${buildPropsVersion}.*/${packageJsonVersion}-modified/g build.properties`);
            ChildProcess.execSync('sed -i s/date=.*/date=/ build.properties');

            if (argv.commit) {
                if (stagedChanges) {
                    reject(new Error('You have other staged changes. Please commit or remove them first.'));
                    return;
                }
                ChildProcess.execSync(`git add build.properties && git commit -m"Cleaned up after v${packageJsonVersion}."`);
                LogLib.message('Clean up commit added. git push when you are ready.');
            }
            LogLib.success(`Cleaned up after v${packageJsonVersion}`);
            resolve();
            return;
        }

        LogLib.message('Preparing version number update. Current version is ' + packageJsonVersion);

        const nextVersion = argv.nextversion;
        if (!argv.cleanup && !nextVersion) {
            reject(new Error('Please provide either --version x.y.z or --cleanup when starting the command.'));
            return;
        }

        /*
            Replace version in relevant files (ideally all current versions should be equal, but since they
            sometimes have proven not to be, we make sure to replace the existing version in the exact file
            with the next version
        */
        ChildProcess.execSync(`sed -i '/version/s/"${packageJsonVersion}"/'\\"${nextVersion}\\"/ package.json`);
        ChildProcess.execSync(`sed -i '/version/s/"${bowerJsonVersion}"/'\\"${nextVersion}\\"/ bower.json`);
        ChildProcess.execSync(`sed -i s/${buildPropsVersion}/${nextVersion}/ build.properties`);

        // replace/fill in date in build.properties
        ChildProcess.execSync('sed -i s/date=.*/date=$(date +%Y-%m-%d)/ build.properties');

        // replace occurences of @ since next in docs with @since x.y.z
        ChildProcess.execSync(`grep -Rl --exclude-dir=node_modules --exclude-dir=code "@since\\s\\+\\next" . | xargs -r sed -i 's/@since *next/@since ${nextVersion}/'`);

        LogLib.success('Updated version in package.json, bower.json, build.properties and replaced @ since next' +
                        ' in the docs. Please review changes and commit & push when ready.');
        resolve();
    });
}

prepareRelease.description = 'Prepares a new release by replacing version numbers with the supplied version. ' +
                                'Replaces version numbers in package.json, bower.json, build.properties and ' +
                                'replaces any "@ since next" tag in docs with the specified nextversion';
prepareRelease.flags = {
    '--cleanup': 'Will add -modified to version and remove date from build.properties. Exludes --version',
    '--commit': 'Commit cleanup changes. Implies --cleanup.',
    '--nextversion': 'Version that will replace version in package.json, build.properties, bower.json and "since next" in the docs.'
};

Gulp.task('prep-release', prepareRelease);
