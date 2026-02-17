/*
 * Copyright (C) Highsoft AS
 */

/* eslint func-style: 0, no-console: 0, max-len: 0 */
const gulp = require('gulp');
const log = require('../libs/log');
const fs = require('fs-extra');
// const fs = require('fs');
// const fsLib = require('../libs/fs');
const { join } = require('path');
const readline = require('readline');
const argv = require('yargs').argv;
const childProcess = require('child_process');
const { getFilesInFolder } = require('@highcharts/highcharts-assembler/src/build.js');
const { removeFile } = require('@highcharts/highcharts-assembler/src/utilities.js');

const releaseRepos = {
    Highcharts: 'highcharts-dist',
    Grid: {
        lite: 'grid-lite-dist',
        pro: 'grid-pro-dist'
    },
    Dashboards: 'dashboards-dist'
};

/**
 * Asks user a question, and waits for input.
 * @param {string} question
 * Question to ask.
 * @return {Promise<*>}
 * Answer.
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
 * Get the handled repos based on the product name.
 * @param {string} productName The product name.
 */
function getHandledRepos(productName) {
    const repos = releaseRepos[productName];
    // Grid has multiple repos (lite and pro), others have single repo
    return typeof repos === 'object' && !Array.isArray(repos) ?
        Object.values(repos) : [repos];
}

/**
 * Commit, tag and push
 *
 * @param {string|number} version To commit, tag and push.
 * @param {boolean} [push] If true will commit, tag and push.
 * If false it will only print the commands to be run.
 * @param {string} productName The product name.
 * @return {Promise<*>} Result
 */
async function runGit(version, push, productName) {
    const handledRepos = getHandledRepos(productName);

    for (const releaseRepo of handledRepos) {
        const commands = [
            'git add --all',
            'git commit -m "v' + version + '"',
            'git tag -a "v' + version + '" -m "Tagged ' + releaseRepo + ' version ' + version + '"',
            'git push',
            'git push origin v' + version
        ];

        const pathToDistRepo = join('..', releaseRepo);

        if (push) {
            const answer = await askUser(
                '\nAbout to run the following commands in ' + pathToDistRepo + ': \n\n' +
                commands.join('\n') +
                `\n\nVerify the file changes in ${releaseRepo}. Look specifically \n` +
                'for removed files. Check updated version numbers in some headers. \n' +
                'To approve or disapprove, press [Y/n]'
            );
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
}

/**
 * Publishes to npm if the --push is part of the argument.
 * @param {boolean} [push]
 * If true it will publish to npm. If false it will only do a dry-run.
 * @param {string} [releaseRepo] The release repo to push to.
 * @return {Promise<*>}
 * Result
 */
async function npmPublish(push = false, releaseRepo = releaseRepos.Highcharts) {
    const pathToDistRepo = join('..', releaseRepo);

    if (push) {
        const answer = await askUser(
            '\nAbout to publish to npm using \'latest\' tag. To approve, \n' +
            'enter the one time password from your 2FA authentication setup. \n' +
            'To try without OTP, enter \'Y\'\n' +
            'To abort, enter \'n\': '
        );
        if (answer === 'n') {
            const message = 'Aborted before invoking \'npm publish\'! Command must be run manually to complete the release.';
            throw new Error(message);
        }
        if (answer !== 'Y' && !answer.match(/^\d{6}$/u)) {
            throw new Error('Invalid OTP. Please enter a 6 digit number.');
        }

        let command = 'npm publish';
        if (answer !== 'Y') {
            command += ` --otp=${answer}`;
        }
        childProcess.execSync(
            command,
            { cwd: pathToDistRepo }
        );
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
 * @param {string} folder
 * Fodler to delete.
 * @param {Array<string>} exceptions
 * Exceptions of files in folder to not delete.
 * @return {Promise<Array<*>>} result
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
 * @param {string} version
 * To replace with
 * @param {Array<string>} files The files to update.
 * @param {string} [productName] The product name.
 */
function updateJSONFiles(version, files, productName) {
    log.message('Updating bower.json and package.json for ' + productName + '...');

    const handledRepos = getHandledRepos(productName);
    for (const releaseRepo of handledRepos) {
        files.forEach(function (file) {
            const fileData = fs.readFileSync('../' + releaseRepo + '/' + file + '.json');
            const json = JSON.parse(fileData);
            if (productName === 'Highcharts') {
                json.types = (
                    json.main ?
                        json.main.replace(/\.js$/u, '.d.ts') :
                        'highcharts.d.ts'
                );

                if (json.dependencies) {
                    delete json.dependencies.jspdf;
                    delete json.dependencies['svg2pdf.js'];
                }

                json.peerDependencies = Object.assign({}, json.peerDependencies, {
                    jspdf: '^4.0.0',
                    'svg2pdf.js': '^2.7.0'
                });

                json.peerDependenciesMeta = Object.assign(
                    {},
                    json.peerDependenciesMeta,
                    {
                        jspdf: { optional: true },
                        'svg2pdf.js': { optional: true }
                    }
                );
            }
            json.version = version;
            const outputJson = JSON.stringify(json, null, '  ');
            fs.writeFileSync('../' + releaseRepo + '/' + file + '.json', outputJson);
        });
    }

    log.message('Json files updated!');
}

/**
 * Copy the JavaScript files over
 */
function copyFiles() {
    const pathToDistRepo = join('..', releaseRepos.Highcharts);

    const mapFromTo = {};
    const folders = [{
        from: 'code',
        to: pathToDistRepo
    }, {
        from: 'css',
        to: join(pathToDistRepo, 'css')
    }];

    const files = {
        // 'vendor/canvg.js': join(pathToDistRepo, 'lib/canvg.js'),
        // 'vendor/jspdf.js': join(pathToDistRepo, 'lib/jspdf.js'),
        // 'vendor/jspdf.src.js': join(pathToDistRepo, 'lib/jspdf.src.js'),
        // 'vendor/svg2pdf.js': join(pathToDistRepo, 'lib/svg2pdf.js'),
        // 'vendor/svg2pdf.src.js': join(pathToDistRepo, 'lib/svg2pdf.src.js')
    };

    const filesToIgnore = [
        '.DS_Store',
        'package.json', // Is handled in `updateJSONFiles`
        '.js.map'
    ];

    const pathsToIgnore = [
        'dashboards',
        'grid',
        'es5'
    ];

    // Copy all the files in the code folder
    folders.forEach(folder => {
        const {
            from,
            to
        } = folder;
        getFilesInFolder(from, true)
            .filter(path => (
                (
                    path.startsWith('es-modules/masters') ||
                    !path.startsWith('es-modules') ||
                    !path.endsWith('.d.ts')
                ) &&
                !pathsToIgnore.some(pattern => path.startsWith(pattern)) &&
                !filesToIgnore.some(pattern => path.endsWith(pattern))
            ))
            .forEach(filename => {
                mapFromTo[join(from, filename)] = join(to, filename);
            });
    });

    // Add additional files to list.
    Object.assign(mapFromTo, files);

    // Copy all the files to release repository
    Object.keys(mapFromTo).forEach(from => {
        const to = mapFromTo[from];
        // libFS.copyAllFiles(from, to);
        fs.copySync(from, to);
    });
    log.message('Files copied successfully!');
}

/**
 * Copy the Grid JavaScript and CSS files over.
 */
function copyGridFiles() {
    const mapFromTo = {};
    const folders = [
        {
            from: join('build', 'dist', 'grid-lite', 'code'),
            to: join('..', releaseRepos.Grid.lite)
        },
        {
            from: join('build', 'dist', 'grid-pro', 'code'),
            to: join('..', releaseRepos.Grid.pro)
        }
    ];

    const filesToIgnore = [
        'package.json'
    ];

    // Copy all the files in the code folder
    folders.forEach(folder => {
        const {
            from,
            to
        } = folder;
        getFilesInFolder(from, true)
            .filter(path => !filesToIgnore.some(pattern => path.endsWith(pattern)))
            .forEach(filename => {
                mapFromTo[join(from, filename)] = join(to, filename);
            });
    });

    // Copy all the files to release repository
    Object.keys(mapFromTo).forEach(from => {
        const to = mapFromTo[from];
        // libFS.copyAllFiles(from, to);
        fs.copySync(from, to);
    });
    log.message('Files copied successfully!');
}

/**
 * Copy the Dashboards JavaScript and CSS files over.
 */
function copyDashboardsFiles() {
    const mapFromTo = {};
    const folders = [
        {
            from: join('build', 'dist', 'dashboards', 'code'),
            to: join('..', releaseRepos.Dashboards)
        }
    ];

    const filesToIgnore = [
        'package.json'
    ];

    // Copy all the files in the code folder
    folders.forEach(folder => {
        const {
            from,
            to
        } = folder;
        getFilesInFolder(from, true)
            .filter(path => !filesToIgnore.some(pattern => path.endsWith(pattern)))
            .forEach(filename => {
                mapFromTo[join(from, filename)] = join(to, filename);
            });
    });

    // Copy all the files to release repository
    Object.keys(mapFromTo).forEach(from => {
        const to = mapFromTo[from];
        fs.copySync(from, to);
    });
    log.message('Files copied successfully!');
}

/**
 * Reads the products from file build/dist/products.js folder.
 * @return {Promise<*>}
 * Result
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
 * Gets the main branch name of the repository.
 * @return {string} Branch name
 */
function getBranchName() {
    return (argv.product || 'Highcharts') === 'Highcharts' ? 'master' : 'main';
}

/**
 * Checks for any untracked or unstaged git changes in the workingDir
 * @param {string} workingDir
 * Directory to use
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
        childProcess.execSync(`git log origin/${getBranchName()}..HEAD`, { cwd: workingDir });
    } catch (error) {
        log.warn('You have unpushed commits. Please make sure it is intended as it will be part of the release.');
    }
}

/**
 * Checks if the branch is something else than expected branch and asks the user if it is ok.
 * @param {string} repoName
 * Name of repo
 * @param {string} workingDir
 * To check the branch name in.
 * @return {Promise<void>}
 * Result
 */
async function checkIfNotExpectedBranch(repoName, workingDir) {
    const branch = childProcess.execSync('git rev-parse --abbrev-ref HEAD', { cwd: workingDir });
    if (branch.toString().trim() !== getBranchName()) {
        const answer = await askUser(`\nThe current ${repoName} branch is ${branch}. Is this correct [Y/n]?`);
        if (answer !== 'Y') {
            throw new Error('Aborting since current branch is not as expected.');
        }
    }
}

/**
 * Checks if the user is logged in on npm for publishing.
 * @param {string} [workingDir] Repository to check.
 * @return {undefined} result
 */
function checkIfLoggedInOnNpm(workingDir) {
    try {
        childProcess.execSync('npm whoami', { cwd: workingDir });
    } catch (error) {
        throw new Error(`Not able to run npm whoami. It may be caused by
        - Not being logged into npm, or
        - The ${workingDir} folder not existing next to highcharts`);
    }
}

/**
 * Based on the product, checks if the code folder exists if it is not, compiles it.
 * @param {string} productName The product name.
 */
async function checkIfCodeExists(productName) {
    const codePaths = {
        Highcharts: ['code/highcharts.js'],
        Grid: [
            join('build', 'dist', 'grid-lite', 'code', 'grid-lite.js')
            // join('build', 'dist', 'grid-pro', 'code', 'grid-pro.js')
        ],
        Dashboards: [
            join('build', 'dist', 'dashboards', 'code', 'dashboards.js')
        ]
    };

    const filePaths = codePaths[productName];
    for (const filePath of filePaths) {
        if (filePath && !fs.existsSync(filePath)) {
            throw new Error(`${productName} code not found. Please run 'npm run dist --product ${productName}' first.`);
        }
    }
}

/**
 * Performs all tasks for copying distribution contents, tagging (highcharts-dist) and releasing on npm.
 *
 * @return {Promise<*> | Promise | Promise} Promise to keep
 */
async function release() {
    // Set some variables
    const productName = argv.product || 'Highcharts';
    const reposSettings = releaseRepos[productName];
    const handledReleaseRepos = productName === 'Grid' ?
        Object.values(reposSettings) : [reposSettings];
    const branchName = getBranchName();

    // Release
    const products = await getProductsJs();
    const key = Object.keys(products).find(k => k.includes(productName));
    const version = products[key].nr;

    await checkIfCodeExists(productName);

    log.starting(`Initiating release of ${productName} version ${version}.`);

    for (const releaseRepo of handledReleaseRepos) {
        const pathToDistRepo = join('..', releaseRepo);

        log.message(`=== Handling '${releaseRepo}' repository. ===`);

        if (argv.push) {
            checkIfLoggedInOnNpm(pathToDistRepo);
        }

        checkForCleanWorkingDirectory(pathToDistRepo);
        await checkIfNotExpectedBranch(releaseRepo, pathToDistRepo);

        log.message(`Pulling latest changes from origin and rebasing against ${branchName} branch.`);

        childProcess.execSync(`git pull --rebase origin ${branchName}`, {
            cwd: pathToDistRepo
        });

        const keepFiles = ['.git', 'bower.json', 'package.json', 'README.md', 'LICENSE.txt'];
        await removeFilesInFolder(pathToDistRepo, keepFiles);
        log.message('Successfully removed content of ' + pathToDistRepo);
    }

    if (productName === 'Highcharts') {
        copyFiles();
        updateJSONFiles(version, ['bower', 'package'], productName);
    } else if (productName === 'Grid') {
        copyGridFiles();
        updateJSONFiles(version, ['package'], productName);
    } else if (productName === 'Dashboards') {
        copyDashboardsFiles();
        updateJSONFiles(version, ['package'], productName);
    }

    await runGit(version, argv.push, productName);

    for (const releaseRepo of handledReleaseRepos) {
        await npmPublish(argv.push, releaseRepo);
    }

    log.success('Release completed successfully!');
    return 'Success!';
}

release.description = 'Copies distribution contents to highcharts-dist repo, tags and publishes on npm (after manual approval).' +
                        'The task assumes that highcharts-dist is already cloned in a sibling folder of this repo.';
release.flags = {
    '--push': '(USE WITH CARE!) Will git commit, push and tag to the highcharts-dist repo, as well as publish to npm. ' +
                'Note that credentials for git/npm must be configured. The user will be asked for input both before the ' +
                'git commands and npm publish is run.',
    '--force-yes': 'Automatically answers yes to all questions.',
    '--product': 'Product name. Available products: Highcharts, Grid. Defaults to Highcharts.'
};

gulp.task('dist-release', release);
