/*
 * Copyright (C) Highsoft AS
 */

/* eslint func-style: 0, no-console: 0, max-len: 0 */
const gulp = require('gulp');
const log = require('./lib/log');
const fs = require('fs-extra');
const { join } = require('path');
const readline = require('readline');
const argv = require('yargs').argv;
const childProcess = require('child_process');
const { getFilesInFolder } = require('highcharts-assembler/src/build.js');
const { removeFile } = require('highcharts-assembler/src/utilities.js');

const PRODUCT_NAME = 'Highcharts';
const releaseRepo = 'highcharts-dist';
const pathToDistRepo = '../' + releaseRepo + '/';


/**
 * Asks user a question, and waits for input.
 * @param {String} question to ask.
 * @return {Promise<unknown>} answer.
 */
async function askUser(question) {
    if (argv.forceYes) {
        return 'Y';
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => {
        rl.question(question, input => resolve(input));
    }).finally(() => rl.close());
}

/**
 * Commit, tag and push
 * @param {String|number} version to commit, tag and push.
 * @param {boolean} push, if true will commit, tag and push.
 *                  If false it will only print the commands to be run.
 * @return {Promise<any>} result
 */
async function runGit(version, push = false) {
    const commands = [
        'git add --all',
        'git commit -m "v' + version + '"',
        'git tag -a "v' + version + '" -m "Tagged ' + PRODUCT_NAME.toLowerCase() + ' version ' + version + '"',
        'git push',
        'git push origin v' + version
    ];

    if (push) {
        const answer = await askUser('\nAbout to run the following commands in ' + pathToDistRepo + ': \n' +
            commands.join('\n') + '\n\n Is this ok? [Y/n]');
        if (answer !== 'Y') {
            const message = 'Aborted before running running git commands!';
            throw new Error(message);
        }

        commands.forEach(command => {
            log.message('Running command: ' + command);
            childProcess.execSync(command, { cwd: pathToDistRepo });
        });
    } else {
        log.message('\n-----(Dryrun)------\n Would have ran the following commands:\n\n' + commands.join(' &&\n') + '\n');
    }
}

/**
 * Publishes to npm if the --push is part of the argument
 * @param {boolean} push, if true if will publish to npm. If false it will only do a dry-run.
 * @return {Promise<any>} result
 */
async function npmPublish(push = false) {
    if (push) {
        const answer = await askUser('\nAbout to publish to npm using \'latest\' tag. Is this ok [Y/n]?');
        if (answer !== 'Y') {
            const message = 'Aborted before invoking \'npm publish\'! Command must be run manually to complete the release.';
            throw new Error(message);
        }
        childProcess.execSync('npm publish', { cwd: pathToDistRepo });
        log.message('Successfully published to npm!');
    } else {
        const version = childProcess.execSync('npm -v', { cwd: pathToDistRepo });
        const npmVersion = parseInt(version.toString().charAt(0), 10);
        log.message('------(Dry run)---------\n\n');
        if (npmVersion >= 6) {
            // dry-run is only available from npm version 6
            childProcess.execSync('npm publish --dry-run', { cwd: pathToDistRepo });
        } else {
            log.message('Skipping npm publish. ');
        }
        log.message('-------(Dry run end)---------------');
        log.warn(`You can clean up by running 'git reset --hard HEAD && git clean -fd' in the folder '${pathToDistRepo}'. DISCLAIMER: It will DELETE ANY UNCOMITTED AND UNTRACKED changes.`);
        log.message('Please verify the changes in the release repo. Then run again with --push as an argument.');
    }
}

/**
 * Removes all files in the folder apart form the paths specified in exceptions.
 * @param {String} folder to delete .
 * @param {Array<String>} exceptions of files in folder to not delete.
 * @return {Promise<[unknown]>} result
 */
async function removeFilesInFolder(folder, exceptions) {
    const files = getFilesInFolder(folder, true, '');
    const promises = files
    // Filter out files that should be kept
        .filter(file => !exceptions.some(pattern => file.match(pattern)))
        .map(file => removeFile(join(folder, file)));
    return Promise.all(promises);
}

/**
 * Add the current version to the Bower and package.json files
 * @param {String} version to replace with
 * @param {String} name which is only used for logging purposes.
 * @return {undefined}
 */
function updateJSONFiles(version, name) {
    log.message('Updating bower.json and package.json for ' + name + '...');

    ['bower', 'package'].forEach(function (file) {
        const fileData = fs.readFileSync('../' + releaseRepo + '/' + file + '.json');
        const json = JSON.parse(fileData);
        json.types = (
            json.main ?
                json.main.replace(/\.js$/, '.d.ts') :
                'highcharts.d.ts'
        );
        json.version = version;
        const outputJson = JSON.stringify(json, null, '  ');
        fs.writeFileSync('../' + releaseRepo + '/' + file + '.json', outputJson);
    });
    log.message('Json files updated!');
}

/**
 * Copy the JavaScript files over
 * @return {undefined} void
 */
function copyFiles() {
    const mapFromTo = {};
    const folders = [{
        from: 'code',
        to: pathToDistRepo
    }, {
        from: 'css',
        to: join(pathToDistRepo, 'css')
    }];

    const files = {
        'vendor/canvg.js': join(pathToDistRepo, 'lib/canvg.js'),
        'vendor/canvg.src.js': join(pathToDistRepo, 'lib/canvg.src.js'),
        'vendor/jspdf.js': join(pathToDistRepo, 'lib/jspdf.js'),
        'vendor/jspdf.src.js': join(pathToDistRepo, 'lib/jspdf.src.js'),
        'vendor/rgbcolor.js': join(pathToDistRepo, 'lib/rgbcolor.js'),
        'vendor/rgbcolor.src.js': join(pathToDistRepo, 'lib/rgbcolor.src.js'),
        'vendor/svg2pdf.js': join(pathToDistRepo, 'lib/svg2pdf.js'),
        'vendor/svg2pdf.src.js': join(pathToDistRepo, 'lib/svg2pdf.src.js')
    };

    // Copy all the files in the code folder
    folders.forEach(folder => {
        const {
            from,
            to
        } = folder;
        getFilesInFolder(from, true)
            .forEach(filename => {
                mapFromTo[join(from, filename)] = join(to, filename);
            });
    });

    // Add additional files to list.
    Object.assign(mapFromTo, files);

    // Copy all the files to release repository
    Object.keys(mapFromTo).forEach(from => {
        const to = mapFromTo[from];
        fs.copySync(from, to);
    });
    log.message('Files copied successfully!');
}

/**
 * Reads the products from file build/dist/products.js folder.
 * @return {Promise<unknown>} result
 */
async function getProductsJs() {
    return new Promise((resolve, reject) => {
        // Load the current products and versions
        fs.readFile('build/dist/products.js', 'utf8', function (err, products) {
            if (err) {
                reject(err);
            }
            if (products) {
                products = products.replace('var products = ', '');
                products = JSON.parse(products);
            }
            resolve(products);
        });
    });
}

/**
 * Checks for any untracked or unstaged git changes in the workingDir
 * @param {String} workingDir to use
 * @return {undefined}
 */
function checkForCleanWorkingDirectory(workingDir) {
    log.message(`Checking that ${workingDir} does not contain any uncommitted changes..`);

    try {
        childProcess.execSync('git diff --name-only --exit-code', { cwd: workingDir });
        childProcess.execSync('git diff --cached --name-only --exit-code', { cwd: workingDir });
        log.message(`No untracked or unstaged changes found in ${workingDir}.`);
    } catch (err) {
        const message = `Your working directory ${workingDir} is not clean. Please resolve any unstaged changes and resolve any untracked changes`;
        log.failure(message);
        throw new Error(err.message);
    }

    try {
        childProcess.execSync('git log origin/master..HEAD', { cwd: pathToDistRepo });
    } catch (error) {
        log.warn('You have unpushed commits. Please make sure it is intended as it will be part of the release.');
    }
}

/**
 * Checks if the branch is something else than master branch and asks the user if it is ok.
 * @param {String} repoName, name of repo
 * @param {String} workingDir to check the branch name in.
 * @return {Promise<void>} result
 */
async function checkIfNotMasterBranch(repoName, workingDir) {
    const branch = childProcess.execSync('git rev-parse --abbrev-ref HEAD', { cwd: workingDir });
    if (branch.toString().trim() !== 'master') {
        const answer = await askUser(`\nThe current ${repoName} branch is ${branch}. Is this correct [Y/n]?`);
        if (answer !== 'Y') {
            throw new Error('Aborting since current branch is not as expected.');
        }
    }
}

/**
 * Checks if the user is logged in on npm for publishing.
 * @return {undefined} result
 */
function checkIfLoggedInOnNpm() {
    try {
        childProcess.execSync('npm whoami', { cwd: pathToDistRepo });
    } catch (error) {
        throw new Error('You are not logged in on npm. Please login using npm login and try again.');
    }
}

/**
 * Performs all tasks for copying distribution contents, tagging (highcharts-dist) and releasing on npm.
 *
 * @return {Promise<*> | Promise | Promise} Promise to keep
 */
async function release() {
    const products = await getProductsJs();
    const version = products[PRODUCT_NAME].nr;
    log.starting(`Initiating release of ${PRODUCT_NAME} version ${version}.`);

    if (argv.push) {
        checkIfLoggedInOnNpm();
    }
    checkForCleanWorkingDirectory(pathToDistRepo);
    await checkIfNotMasterBranch(releaseRepo, pathToDistRepo);

    log.message('Pulling latest changes from origin and rebasing against master branch.');
    childProcess.execSync('git pull --rebase origin master', { cwd: pathToDistRepo });

    const keepFiles = ['.git', 'bower.json', 'package.json', 'README.md'];
    await removeFilesInFolder(pathToDistRepo, keepFiles);
    log.message('Successfully removed content of ' + pathToDistRepo);

    copyFiles();
    updateJSONFiles(version, PRODUCT_NAME);
    await runGit(version, argv.push);
    await npmPublish(argv.push);

    log.success('Release completed successfully!');
    return 'Success!';
}

release.description = 'Copies distribution contents to highcharts-dist repo, tags and publishes on npm (after manual approval).' +
                        'The task assumes that highcharts-dist is already cloned in a sibling folder of this repo.';
release.flags = {
    '--push': '(USE WITH CARE!) Will git commit, push and tag to the highcharts-dist repo, as well as publish to npm. ' +
                'Note that credentials for git/npm must be configured. The user will be asked for input both before the ' +
                'git commands and npm publish is run.',
    '--force-yes': 'Automatically answers yes to all questions.'
};

gulp.task('dist-release', release);
