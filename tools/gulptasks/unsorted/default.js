/* eslint-disable */
const gulp = require('gulp');
const {
    join,
    sep
} = require('path');
const compileSingleStyle = fileName => {
    const {
        writeFilePromise
    } = require('highcharts-assembler/src/utilities.js');
    const {
        promisify
    } = require('../../filesystem.js');
    const sass = require('node-sass');
    const sassRender = promisify(sass.render);
    const input = './css/' + fileName;
    const output = './code/css/' + fileName.replace('.scss', '.css');
    return Promise
        .resolve()
        .then(() => sassRender({
            file: input,
            outputStyle: 'expanded'
        }))
        .then(result => writeFilePromise(output, result.css));
};
/**
 * Watch changes to JS and SCSS files
 *
 * @return {Promise}
 *         Promise to keep
 */
function defaultWatch() {
    const argv = require('yargs').argv;
    const LogLib = require('../lib/log');
    const ProcessLib = require('../lib/process');
    if (ProcessLib.isRunning('scripts-watch') && !argv.force) {
        LogLib.warn('Running watch process detected. Skipping task...');
        return Promise.resolve();
    }
    const {
        getBuildScripts
    } = require('../../build.js');
    const {
        fnFirstBuild,
        mapOfWatchFn
    } = getBuildScripts({});
    const watchlist = [
        './css/*.scss',
        './js/**/*.js',
        './code/es-modules/**/*.js'
    ];
    const msgBuildAll = 'Built JS files from modules.'.cyan;
    let watcher;
    const onChange = path => {
        const posixPath = path.split(sep).join('/');
        let promise;

        if (posixPath.startsWith('css')) {
            // Stop the watcher temporarily.
            watcher.close();
            watcher = null;
            // Run styles and build all files.
            promise = styles().then(() => {
                if (shouldBuild()) {
                    fnFirstBuild();
                    console.log(msgBuildAll);
                } else {
                    console.log('✓'.green, 'Code up to date.'.gray);
                }
                // Start watcher again.
                watcher = gulp.watch(watchlist).on('change', onChange);
            });
        } else if (posixPath.startsWith('js')) {
            // Build es-modules
            promise = mapOfWatchFn['js/**/*.js']({ path: posixPath, type: 'change' });
        } else if (posixPath.startsWith('code/es-modules')) {
            // Build dist files in classic mode.
            promise = mapOfWatchFn['code/es-modules/**/*.js']({ path: posixPath, type: 'change' });
        }

        return promise;
    };
    ProcessLib.isRunning('scripts-watch', true);
    return styles().then(() => {
        if (shouldBuild()) {
            fnFirstBuild();
            console.log(msgBuildAll);
        } else {
            console.log('✓'.green, 'Code up to date.'.gray);
        }
        // Start watching source files.
        watcher = gulp.watch(watchlist).on('change', onChange);
    });
}
/**
 * @private
 * Tests whether the code is in sync with source.
 *
 * @return {boolean}
 *         True, if code is out of sync.
 */
function shouldBuild() {
    const glob = require('glob');
    const getModifiedTime = fsPattern => {
        let modifyTime = 0;
        glob.sync(fsPattern)
            .forEach(file => {
                modifyTime = Math.max(modifyTime, fs.statSync(file).mtimeMs);
            });
        return modifyTime;
    };
    const buildPath = join(__dirname, 'code', '**', '*.js');
    const sourcePath = join(__dirname, 'js', '**', '*.js');
    const latestBuildTime = getModifiedTime(buildPath);
    const latestSourceTime = getModifiedTime(sourcePath);
    return (latestBuildTime <= latestSourceTime);
}
/**
 * Creates CSS files
 *
 * @return {Promise}
 *         Promise to keep
 */
function styles() {
    const {
        getFilesInFolder
    } = require('highcharts-assembler/src/build.js');
    const {
        copyFile,
    } = require('../../filesystem.js');
    const promisesCopyGfx = getFilesInFolder('./gfx', true)
        .map(path => copyFile(join('./gfx', path), join('./code/gfx', path)));
    const promisesCompileStyles = getFilesInFolder('./css', true)
        .map(file => compileSingleStyle(file));
    const promises = [].concat(promisesCopyGfx, promisesCompileStyles);
    return Promise.all(promises).then(() => {
        console.log('Built CSS files from SASS.'.cyan);
    });
}
gulp.task('default', defaultWatch);
