/*
 * Copyright (C) Highsoft AS
 */

/* eslint-disable no-use-before-define, node/no-unsupported-features/node-builtins */

/* *
 *
 *  Imports
 *
 * */

const fs = require('fs').promises,
    gulp = require('gulp'),
    path = require('path');

/* *
 *
 *  Constants
 *
 * */

const assembledBundles = [];

const DEFAULT_PATTERN =
    /(var __importDefault =[\s\S]*?)(?=\s+\(function \(factory)/;

const FACTORY_PATTERN =
    /\(function \(factory\) \{[\s\S]*?\}\)\(function \(require, exports\) \{/;

const PRODUCT_MASTERS = [
    'highcharts',
    'highcharts-gantt',
    'highmaps',
    'highstock'
];

const REQUIRE_PATTERN = /(require\(")([\/\.\w]+)("\))/g;

const SOURCE_FOLDER = 'ts';

const TARGET_FOLDER = 'code2';

/* *
 *
 *  Functions
 *
 * */

function addFactory(modulePath, moduleCode) {
    const moduleName = path.basename(modulePath);

    /* eslint-disable indent */
    return (
`(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        factory['default'] = factory;
        module.exports = root.document ?
            factory(root) :
            factory;
    } else if (typeof define === 'function' && define.amd) {
        define('highcharts/${moduleName}', function () {
            return factory(root);
        });
    } else {
        ${
            isProductMaster(modulePath) ?
                `if (root.Highcharts) {
                    root.Highcharts.error(16, true);
                }` :
                ''
        }
        root.Highcharts = factory(root);
    }
}(window || this, function (window) {
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    var _modules = {};
    function _registerModule(path, fn) {
        if (!_modules[path]) {
            _modules[path] = fn(window.Highcharts);
            if (typeof CustomEvent === 'function') {
                window.dispatchEvent(new CustomEvent(
                    'HighchartsModuleLoaded',
                    { detail: { path: path, module: _modules[path] } }
                ));
            }
        }
    }function require(mod) {
        return _modules[mod];
    };
    ${moduleCode}
    }));
`
    );
    /* eslint-enable indent */
}

function addHelpers(modulePath, moduleCode) {

    modulePath = modulePath.replace(/.src.js$/u, '');

    moduleCode = moduleCode.replace(DEFAULT_PATTERN, '');

    moduleCode = moduleCode.replace(
        FACTORY_PATTERN,
        `_registerModule("${modulePath}", function (H) {`
    );

    moduleCode = moduleCode.replace(
        REQUIRE_PATTERN,
        (
            _match,
            requireOpen,
            requirePath,
            requireClose
        ) => [
            requireOpen,
            path.posix.join(
                path.relative(
                    path.dirname(modulePath),
                    path.dirname(requirePath)
                ),
                path.basename(requirePath)
            ),
            requireClose
        ].join('')
    );

    return moduleCode;
}

/**
 * Creates bundles of required files.
 *
 * @param {string} filePath
 * Path to file to assemble.
 *
 * @param {string} basePath
 * Base path to filter from module registry.
 *
 * @return {Promise}
 * Promise to keep.
 */
async function assembleBundle(filePath, basePath) {
    const requiredModules =
        await extractRequiredModules(filePath, isProductMaster(filePath));

    let assembly = '';

    for (const requiredModule of requiredModules) {
        assembly += addHelpers(
            path.relative(basePath, requiredModule),
            (await fs.readFile(requiredModule)).toString()
        );
    }

    assembly += addHelpers(
        path.relative(basePath, filePath),
        (await fs.readFile(filePath)).toString()
    );

    await fs.writeFile(
        filePath,
        addFactory(filePath, assembly)
    );
}

/**
 * Extracts the paths of require calls in the given file.
 *
 * @param {string} filePath
 * Path to the file to extract from.
 *
 * @param {boolean} recursive
 * Whether to include indirect required modules.
 *
 * @return {Promise<Array<string>>}
 * Ordered array of required modules.
 */
async function extractRequiredModules(filePath, recursive) {
    const file = (await fs.readFile(filePath)).toString(),
        moduleBase = path.dirname(filePath),
        requireMatchs = file.matchAll(REQUIRE_PATTERN),
        requiredModules = [];

    for (const requireMatch of requireMatchs) {
        requiredModules.push(path.join(moduleBase, requireMatch[2]));
    }

    if (recursive) {
        for (const requiredModule of requiredModules) {
            if (!assembledBundles.includes(requiredModule)) {
                const moreRequiredModules =
                    await extractRequiredModules(requiredModule, true);

                for (const anotherRequiredModule of moreRequiredModules) {
                    if (!requiredModules.includes(anotherRequiredModule)) {
                        requiredModules.push(anotherRequiredModule);
                    }
                }
            }
        }
    }

    return requiredModules;
}

/**
 * Determs if a file is one of a product containing core files.
 *
 * @param {string} filePath
 * File path to test.
 *
 * @return {boolean}
 * Whether file is product master.
 */
function isProductMaster(filePath) {
    return PRODUCT_MASTERS.includes(path.basename(filePath, '.src.js'));
}

/* *
 *
 *  Tasks
 *
 * */

/**
 * Builds TypeScript files from the source folder into the target folder.
 *
 * @return {Promise}
 * Promise to keep.
 */
async function scriptsESX() {
    const fsLib = require('./lib/fs'),
        logLib = require('./lib/log'),
        processLib = require('./lib/process');

    try {
        processLib.isRunning('scripts-esx', true);

        logLib.message(`Deleting ${TARGET_FOLDER}...`);

        fsLib.deleteDirectory(TARGET_FOLDER, true);

        logLib.message(`Building ${TARGET_FOLDER}...`);

        await processLib.exec([
            'npx tsc',
            `--project "${SOURCE_FOLDER}"`,
            '--module UMD',
            `--outDir "${TARGET_FOLDER}"`
        ].join(' '));

        const filePaths = fsLib.getFilePaths(TARGET_FOLDER, true);

        logLib.message(`Assembling ${TARGET_FOLDER}...`);

        for (let i = 0, iEnd = filePaths.length, filePath; i < iEnd; ++i) {
            filePath = filePaths[i];

            if (
                filePath.includes('/masters/') &&
                !filePath.endsWith('.d.ts') &&
                !assembledBundles.includes(filePath)
            ) {
                logLib.message(`Assembling ${path.basename(filePath)}...`);
                await assembleBundle(filePath, TARGET_FOLDER);
                assembledBundles.push(filePath);
            }
        }

        logLib.success('Done.');

    } finally {
        processLib.isRunning('scripts-esx', false);
    }
}

gulp.task('scripts-esx', gulp.series('scripts-messages', scriptsESX));
