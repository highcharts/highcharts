/*
 * Copyright (C) Highsoft AS
 */

/* eslint-disable func-style, no-use-before-define, quotes */


/* *
 *
 *  Imports
 *
 * */


const FS = require('node:fs/promises');

const Gulp = require('gulp');

const Path = require('node:path');


/* *
 *
 *  Constants
 *
 * */


const INFO = `
npx gulp api-tree [OPTIONS]

OPTIONS:
  --info            This information.
  --debug           Includes source code of the related node.
  --sources [path]  Only loads source files from the given path. (recursive)
`;


/* *
 *
 *  Task
 *
 * */


/**
 * Creates an API tree.
 *
 * @todo filter out private members and options
 *
 * @return {Promise}
 * Promise to keep.
 */
async function apiTree() {
    const FSLib = require('./lib/fs');
    const TSLib = require('../lib/ts');
    const LogLib = require('./lib/log');
    const argv = require('yargs').argv;

    if (argv.info) {
        process.stdout.write(INFO);
        return;
    }

    const sources = argv.sources;

    let singleFile = false;
    let moduleSource = Path.join('ts', 'Core');
    let optionSource = 'ts';

    if (sources) {
        singleFile = FSLib.isFile(sources);
        moduleSource = sources;
        optionSource = sources;
    }

    const moduleFiles = (
        singleFile ?
            [moduleSource] :
            FSLib
                .getFilePaths(moduleSource, true)
                .filter(path => !(
                    path.endsWith('Options.d.ts') ||
                    path.endsWith('Options.ts')
                ))
    );
    const optionFiles = (
        singleFile ?
            [optionSource] :
            FSLib
                .getFilePaths(optionSource, true)
                .filter(path => (
                    path.endsWith('Options.d.ts') ||
                    path.endsWith('Options.ts')
                ))
    );

    LogLib.warn(`Parsing ${moduleFiles.length} module files ...`);

    const moduleTree = {
        _meta: {
            version: JSON
                .parse(await FS.readFile('package.json', 'utf8'))
                .version
        }
    };

    for (const file of moduleFiles) {
        moduleTree[file] = TSLib.getSourceInfo(
            file,
            await FS.readFile(file, 'utf8'),
            argv.debug
        );
    }

    LogLib.success('Done.');

    LogLib.warn(`Writing tree-modules.json ...`);

    await FS.writeFile(
        'tree-modules.json',
        TSLib.toJSONString(moduleTree, '    '),
        'utf8'
    );

    LogLib.success('Done.');

    LogLib.warn(`Parsing ${optionFiles.length} option files ...`);

    const optionTree = {
        _meta: {
            version: JSON
                .parse(await FS.readFile('package.json', 'utf8'))
                .version
        }
    };

    for (const file of optionFiles) {
        optionTree[file] = TSLib.getSourceInfo(
            file,
            await FS.readFile(file, 'utf8'),
            argv.debug
        );
    }

    LogLib.success('Done.');

    LogLib.warn(`Writing tree-options.json ...`);

    await FS.writeFile(
        'tree-options.json',
        TSLib.toJSONString(optionTree, '    '),
        'utf8'
    );

    LogLib.success('Done.');

}


/* *
 *
 *  Tasks
 *
 * */


Gulp.task('api-tree', apiTree);
