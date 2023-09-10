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

/** Avoid assembling the same file twice in bundle-bundle dependencies. */
const assembledBundles = [];

/** Finds TypeScript's module default import line. */
const IMPORT_DEFAULT_PATTERN =
    /(var __importDefault =[\s\S]*?)(?=\s+\(function \(factory)/;

/** Finds TypeScript's module factory call. */
const FACTORY_PATTERN =
    /\(function \(factory\) \{[\s\S]*?\}\)\(function \(require, exports\) \{/;

/** Main product bundles that should contain all sub dependencies. **/
const PRODUCT_MASTERS = [
    'dashboards',
    'highcharts',
    'highcharts-gantt',
    'highmaps',
    'highstock'
];

/** Finds TypeScript's module require lines. */
const REQUIRE_PATTERN = /(require\(")([\/\.\w]+)("\))/g;

/* *
 *
 *  Functions
 *
 * */

function addFactory(modulePath, moduleCode, basePath, namespace) {
    const externalModulePath = [
        namespace.toLowerCase(),
        path.relative(basePath, modulePath).split('.')[0]
    ].join('/');
    const isPM = isProductMaster(modulePath);

    /* eslint-disable indent */
    return (
`(function (root, factory) {
if (typeof module === "object" && module.exports) {
    factory["default"] = factory;
    module.exports = ${isPM ? 'root.document ? factory(root) : ' : ''} factory;
} else if (typeof define === "function" && define.amd) {
    define("${externalModulePath}", function () {
        return factory(root);
    });
} else {
    ${
        isPM ?
    `if (typeof root.${namespace} !== "undefined")
        root.${namespace}.error(16, true);
    else
        root.${namespace} = factory({});` :
    `factory(root.${namespace});`
    }
}
}(this, function (H) {
var _modules = H._modules || {};
function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
function _registerModule(path, fn) {
    if (!_modules[path]) {
        var module = {};
        fn(module);
        _modules[path] = module;
        if (typeof CustomEvent === "function") {
            window.dispatchEvent(new CustomEvent(
                "HighchartsModuleLoaded",
                { detail: { path: path, module: __importDefault(_modules[path]).default } }
            ));
        }
    }
}
function require(path) {
    return _modules[path];
}
${moduleCode}
${
    isPM ?
`var H = __importDefault(_modules["${modulePath}"]).default;
H._modules = _modules;
return H;` :
    ''
}
}));
`
    );
    /* eslint-enable indent */
}

function addHelpers(modulePath, moduleCode) {

    moduleCode = moduleCode.replace(IMPORT_DEFAULT_PATTERN, '');

    moduleCode = moduleCode.replace(
        FACTORY_PATTERN,
        `_registerModule("${modulePath}", function (exports) {`
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
                path.dirname(modulePath),
                requirePath
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
async function assembleBundle(
    filePath,
    basePath,
    sourcePath,
    targetPath,
    namespace
) {
    const requiredModules =
        await extractRequiredModules(filePath, filePath.endsWith('.src.js'));

    let assembly = '';

    for (const requiredModule of requiredModules) {
        assembly += addHelpers(
            path.relative(basePath, requiredModule),
            (await fs.readFile(requiredModule)).toString()
        );
    }

    const modulePath = path.relative(basePath, filePath);
    assembly += addHelpers(
        modulePath,
        (await fs.readFile(filePath)).toString()
    );

    const targetFile =
        path.join(targetPath, path.relative(sourcePath, filePath));

    await fs.mkdir(path.dirname(targetFile), { recursive: true });
    await fs.writeFile(
        targetFile,
        addFactory(modulePath, assembly, sourcePath, namespace)
    );

    assembledBundles.push(filePath);
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
        isPM = isProductMaster(filePath),
        moduleBase = path.dirname(filePath),
        requireMatchs = file.matchAll(REQUIRE_PATTERN),
        requiredModules = [];

    let modulePath;

    for (const requireMatch of requireMatchs) {
        modulePath = path.join(moduleBase, requireMatch[2]);

        if (
            recursive &&
            (
                isPM ||
                !assembledBundles.includes(modulePath)
            )
        ) {
            const moreMatches = await extractRequiredModules(modulePath, true);

            for (let i = 0, iEnd = moreMatches.length; i < iEnd; ++i) {
                if (!requiredModules.includes(moreMatches[i])) {
                    requiredModules.push(moreMatches[i]);
                }
            }
        }

        if (!requiredModules.includes(modulePath)) {
            requiredModules.push(modulePath);
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
 * @param {Record<string,(boolean|number|string)} [options]
 * Options to call task as function.
 *
 * @return {Promise}
 * Promise to keep.
 */
async function scriptsESX(
    options
) {
    const fsLib = require('./lib/fs');
    const logLib = require('./lib/log');
    const processLib = require('./lib/process');

    options = typeof options === 'object' ? options : {};

    try {
        const bundleTargetFolder = (
                options.bundleTargetFolder ||
                'code'
            ),
            esModulesFolder = (
                options.esModulesFolder ||
                path.join(bundleTargetFolder, 'es-modules')
            ),
            bundleSourceFolder = (
                options.bundleSourceFolder ||
                path.join(esModulesFolder, 'masters')
            ),
            namespace = options.namespace || 'Highcharts',
            typeScriptFolder = (options.typeScriptFolder || 'ts');

        processLib.isRunning('scripts-esx', true);

        logLib.message(`Deleting ${esModulesFolder}...`);

        fsLib.deleteDirectory(esModulesFolder, true);

        logLib.message(`Deleting ${bundleTargetFolder}...`);

        fsLib.deleteDirectory(bundleTargetFolder, true);

        logLib.message(`Building ${bundleTargetFolder}...`);

        await processLib.exec([
            'npx tsc',
            `--project "${typeScriptFolder}"`,
            '--module UMD',
            `--outDir "${esModulesFolder}"` // Use ESM temporarily for UMD
        ].join(' '));

        const filePaths = fsLib.getFilePaths(bundleSourceFolder, true);

        logLib.message(`Bundling ${bundleTargetFolder}...`);

        for (let i = 0, iEnd = filePaths.length, filePath; i < iEnd; ++i) {
            filePath = filePaths[i];

            if (
                !filePath.endsWith('.d.ts') &&
                !assembledBundles.includes(filePath)
            ) {
                logLib.message(`Assembling ${path.basename(filePath)}...`);

                await assembleBundle(
                    filePath,
                    esModulesFolder,
                    bundleSourceFolder,
                    bundleTargetFolder,
                    namespace
                );
            }
        }

        logLib.message(`Deleting ${esModulesFolder}...`);

        fsLib.deleteDirectory(esModulesFolder, true);

        logLib.message(`Building ${esModulesFolder}...`);

        await processLib.exec([
            'npx tsc',
            `--project "${typeScriptFolder}"`,
            `--outDir "${esModulesFolder}"`
        ].join(' '));


        logLib.success('Done.');

    } finally {
        processLib.isRunning('scripts-esx', false);
    }
}

gulp.task('scripts-esx', gulp.series('scripts-messages', scriptsESX));

/* *
 *
 *  Default Export
 *
 * */

module.exports = scriptsESX;
