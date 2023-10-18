/* eslint func-style: 0, no-console: 0 */
const { randomUUID } = require('crypto');
const processLib = require('../lib/process');
const logLib = require('../lib/log');

const gulp = require('gulp');
/**
 * Executes a single terminal command and returns when finished.
 * Outputs stdout to the console.
 * @param {string} command Command to execute in terminal
 * @return {string} Returns all output to the terminal in the form of a string.
 */
const commandLine = command => new Promise((resolve, reject) => {
    const {
        exec
    } = require('child_process');
    const cli = exec(command, (error, stdout) => {
        if (error) {
            console.log(error);
            reject(error);
        } else {
            console.log('Command finished: ' + command);
            resolve(stdout);
        }
    });
    cli.stdout.on('data', data => console.log(data.toString()));
});
const filesize = async () => {
    const {
        getBuildScripts
    } = require('../../build.js');
    const colors = require('colors');
    const {
        getFile
    } = require('@highcharts/highcharts-assembler/src/utilities.js');
    const {
        argv
    } = require('yargs');
    const scriptsCompile = require('../../../tools/gulptasks/scripts-compile');

    const sourceFolder = './code/';
    // @todo Correct type names to classic and styled and rename the param to
    // 'mode'
    const types = argv.type ? [argv.type] : ['classic'];
    const filenames = argv.file ? argv.file.split(',') : ['highcharts.src.js'];
    const files = filenames.reduce((arr, name) => {
        const p = types.map(t => (t === 'css' ? 'js/' : '') + name);
        return arr.concat(p);
    }, []);
    const getGzipSize = content => {
        const gzipSize = require('gzip-size');
        return gzipSize.sync(content);
    };
    // const pad = (str, x) => ' '.repeat(x) + str;
    const padRight = (str, x) => str + ' '.repeat(x - str.length);
    const printRow = (sizes, content) => content.map((c, i) => padRight(c.toString(), sizes[i])).join('');
    const report = (name, current, head) => {
        const colsizes = [10, 10, 10, 10];
        const diff = (a, b) => {
            const d = a - b;
            const sign = d > 0 ? '+' : '';
            // const color = diff > 0 ? 'yellow' : 'green';
            return sign + d;
        };
        console.log([
            '',
            colors.cyan(name),
            printRow(colsizes, ['', 'gzipped', 'compiled', 'source']),
            printRow(colsizes, ['New:', current.gzip, current.compiled, current.size]),
            printRow(colsizes, ['HEAD:', head.gzip, head.compiled, head.size]),
            printRow(colsizes, ['Diff:', diff(current.gzip, head.gzip) + 'B', diff(current.compiled, head.compiled) + 'B', diff(current.size, head.size) + 'B']),
            ''
        ].join('\n'));
    };

    const runFileSize = async (obj, key) => {
        await getBuildScripts({ files }).fnFirstBuild();
        await scriptsCompile(files.map(path => `${sourceFolder}${path}`));
        files.reduce(
            (o, n) => {
                const filename = n.replace('.src.js', '.js');
                const compiled = getFile(sourceFolder + filename);
                const content = getFile(sourceFolder + n);
                if (!o[filename]) {
                    o[filename] = {};
                }
                o[filename][key] = {
                    gzip: getGzipSize(compiled),
                    size: content.length,
                    compiled: compiled.length
                };
                return o;
            }, obj
        );
    };

    const stashName = `filesize-stash-${randomUUID()}`;
    const results = {};

    /**
     * Runs typescript compilation if scripts-watch is not running
     * @return {Promise<void | string>} Promise
     */
    async function compileTypescript() {
        if (!processLib.isRunning('scripts-watch')) {
            return commandLine('npx gulp scripts-ts');
        }

        return logLib.warn('Scripts-watch is running, skipping TS compilation');
    }

    await compileTypescript();
    await runFileSize(results, 'new');
    await commandLine(`git add . && git stash push -m '${stashName}'`);
    await compileTypescript();
    await runFileSize(results, 'head');

    // use grep to get just the first result
    const list = await commandLine(`git stash list | grep -m1 ${stashName}`);

    if (list.length) {
        const stashRegex = new RegExp(`^stash\@\{(.*)\}:.+?${stashName}`);
        const match = list.match(stashRegex);
        if (!match.length) {
            throw new Error('could not find filesize stash, aborting');
        }
        const stashIndex = match[1];
        await commandLine(`git stash pop stash@{${stashIndex}}`);
    }

    const keys = Object.keys(results);
    keys.forEach(key => {
        const values = results[key];
        report(key, values.new, values.head);
    });
};
gulp.task('filesize', filesize);
