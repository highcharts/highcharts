/*
 * Copyright (C) Highsoft AS
 */


const fs = require('fs');
const gulp = require('gulp');
const path = require('path');


/* *
 *
 *  Tasks
 *
 * */


/**
 * Copies files over to the dashboards-dist repository, which has to be placed
 * in the same parent folder as this repository. Prepares dashboards-dist
 * repository for release.
 *
 * @return {Promise<void>}
 * Promise to keep.
 */
async function distRelease() {

    const argv = require('yargs').argv;
    const config = require('./_config.json');
    const fsLib = require('../lib/fs');
    const logLib = require('../lib/log');
    const processLib = require('../lib/process');

    const release = argv.release;

    if (!/^\d+\.\d+\.\d+(?:-\w+)?$/su.test(release)) {
        throw new Error('No valid `--release x.x.x` provided.');
    }

    const buildFolder = config.buildFolder;
    const distRepository = config.distRepository;

    if (!fs.existsSync(distRepository)) {
        logLib.failure(`${distRepository} not found!`);
        throw new Error('Repository Error');
    }

    // Clean repository

    await processLib.exec('git fetch origin', {
        cwd: distRepository
    });
    await processLib.exec('git reset --hard origin/main', {
        cwd: distRepository
    });
    await processLib.exec('git clean -d --force', {
        cwd: distRepository
    });
    await processLib.exec('git reset', {
        cwd: distRepository
    });
    await processLib.exec('git checkout .', {
        cwd: distRepository
    });

    // Remove deprecated files and folders

    fsLib.deleteDirectory(
        path.join(distRepository, 'css', 'dashboards'),
        true
    );

    fsLib.deleteDirectory(path.join(distRepository, 'examples'), true);

    fsLib.deleteDirectory(
        path.join(distRepository, 'gfx', 'dashboard-icons'),
        true
    );

    // Copy build/dist into repository

    fsLib.copyAllFiles(path.join(buildFolder, 'code'), distRepository, true);

    fsLib.copyFile(
        config.readmeFile,
        path.join(distRepository, 'README.md'),
        true
    );

    // Change version

    await processLib.exec(`npm version --no-git-tag-version ${release}`, {
        cwd: distRepository
    });

    // Create commit

    await processLib.exec('git add .', {
        cwd: distRepository
    });
    await processLib.exec(`git commit -m "v${release}"`, {
        cwd: distRepository
    });

    // Do magic

    if (argv.dryrun) {
        logLib.warn(`Skipped \`git tag v${release}\``);
        await processLib.exec('npm publish --access public --dry-run', {
            cwd: distRepository
        });
    } else {
        await processLib.exec(`git tag v${release}`, {
            cwd: distRepository
        });
        // Play safe - do manually
        // await processLib.exec('git push', {
        //     cwd: distRepository
        // });
        // await processLib.exec('git push origin --tags', {
        //     cwd: distRepository
        // });
        // await processLib.exec('npm publish --access public', {
        //     cwd: distRepository
        // });
    }

    logLib.success(`Updated ${distRepository}`);

    // Play safe

    logLib.warn([
        `Run following commands in ${distRepository}:`,
        'git push',
        'git push origin --tags',
        'npm publish --access public'
    ].join('\n'));

}


gulp.task('dashboards/dist-release', distRelease);
