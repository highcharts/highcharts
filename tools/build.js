/* eslint-env node, es6 */
/* eslint no-console:0, no-path-concat:0, no-nested-ternary:0, valid-jsdoc:0 */
/* eslint-disable func-style */
const colors = require('colors');
const {
    join,
    relative,
    resolve,
    sep
} = require('path');
const {
    readFileSync
} = require('fs');
const {
    buildModules,
    buildDistFromModules,
    getFilesInFolder
} = require('highcharts-assembler/src/build.js');
const {
    getOrderedDependencies,
    regexGetCapture
} = require('highcharts-assembler/src/dependencies.js');
const {
    checkDependency
} = require('./filesystem.js');
const build = require('highcharts-assembler');

// TODO move to a utils file
const isArray = x => Array.isArray(x);
const isUndefined = x => typeof x === 'undefined';

/**
 * Get the product version from build.properties.
 * The product version is used in license headers and in package names.
 * @return {string|null} Returns version number or null if not found.
 */
const getProductVersion = () => {
    const properties = readFileSync('./build.properties', 'utf8');
    return regexGetCapture(/product\.version=(.+)/, properties);
};

const getBuildOptions = input => {
    const {
        base = './js/masters/',
        debug = false,
        version = getProductVersion(),
        output = './code/'
    } = input;
    const files = (
        isArray(input.files) ?
            input.files :
            getFilesInFolder(base, true)
    );
    const type = ['classic'];
    const mapTypeToSource = {
        classic: './code/es-modules',
        css: './code/js/es-modules'
    };
    return {
        base,
        debug,
        files,
        output,
        type,
        version,
        mapTypeToSource
    };
};

const scripts = params => {
    checkDependency('highcharts-assembler', 'warn', 'devDependencies');
    const options = getBuildOptions(params);
    return build(options);
};


const getListOfDependencies = (files, fileOptions, pathSource) => {
    const dependencyList = {};
    files.forEach(filename => {
        const options = fileOptions[filename];
        const exclude = (
            !isUndefined(options) && !isUndefined(options.exclude) ?
                options.exclude :
                false
        );
        const pathFile = join(pathSource, 'masters', filename);
        const list = getOrderedDependencies(pathFile)
            .filter(pathModule => {
                let result = true;
                if (exclude) {
                    result = !exclude.test(pathModule);
                }
                return result;
            })
            .map(str => resolve(str));
        dependencyList[pathFile] = list;
    });
    return dependencyList;
};

const getTime = () => (new Date()).toTimeString().substr(0, 8);

const watchSourceFiles = (event, types) => {
    const pathFile = event.path;
    const base = './js/';
    const output = './code/';
    const pathRelative = relative(base, pathFile);
    console.log([
        '',
        `${event.type}:`.cyan + ` ${relative('.', pathFile)} ` +
        getTime().gray,
        'Rebuilding files: '.cyan,
        types
            .map(type => colors.gray(
                `- ${join(output, type === 'css' ? 'js' : '', 'es-modules', pathRelative)}`
            ))
            .join('\n')
    ].join('\n'));
    return buildModules({
        base,
        files: [pathRelative.split(sep).join('/')],
        output,
        type: types
    });
};

const watchESModules = (event, options, type, dependencies, pathESMasters) => {
    const pathFile = resolve(event.path);
    const filesModified = (
        Object
            .keys(dependencies)
            .reduce((arr, pathMaster) => {
                const list = dependencies[pathMaster];
                if (list.includes(pathFile)) {
                    arr.push(relative(pathESMasters, pathMaster).split(sep).join('/'));
                }
                return arr;
            }, [])
    );
    console.log([
        `${event.type}:`.cyan + ` ${relative('.', pathFile)} ` +
        getTime().gray,
        'Rebuilding files: '.cyan,
        filesModified
            .map(str => colors.gray(
                `- ${join('code', type === 'css' ? 'js' : '', str)}`
            ))
            .join('\n')
    ].join('\n'));
    const {
        debug,
        fileOptions,
        version
    } = options;
    return buildDistFromModules({
        base: pathESMasters,
        debug,
        fileOptions,
        files: filesModified,
        output: './code/',
        type: [type],
        version
    });
};

const fnFirstBuild = options => {
    // Build all module files
    const pathJSParts = './js/';
    const pathESModules = './code/';
    const {
        type: types,
        mapTypeToSource,
        debug,
        fileOptions,
        files,
        version
    } = options;
    buildModules({
        base: pathJSParts,
        output: pathESModules,
        type: types
    });
    const promises = [];
    promises.push(require('./error-messages')());
    types.forEach(type => {
        const pathSource = mapTypeToSource[type];
        const pathESMasters = join(pathSource, 'masters');
        promises.push(buildDistFromModules({
            base: pathESMasters,
            debug,
            fileOptions,
            files,
            output: './code/',
            type: [type],
            version
        }));
    });
    return Promise.all(promises);
};

const getBuildScripts = params => {
    checkDependency('highcharts-assembler', 'warn', 'devDependencies');
    const options = getBuildOptions(params);
    const {
        files,
        type: types,
        fileOptions,
        mapTypeToSource
    } = options;
    const result = {
        fnFirstBuild: () => fnFirstBuild(options),
        mapOfWatchFn: {
            'js/**/*.js': event => watchSourceFiles(event, types)
        }
    };
    types.forEach(type => {
        const pathSource = mapTypeToSource[type];
        const pathESMasters = join(pathSource, 'masters');
        const key = join(pathSource, '**/*.js').split(sep).join('/');
        const fn = event => {
            const dependencies = getListOfDependencies(
                files,
                fileOptions,
                pathSource
            );
            return watchESModules(
                event,
                options,
                type,
                dependencies,
                pathESMasters
            );
        };
        result.mapOfWatchFn[key] = fn;
    });
    return result;
};

module.exports = {
    getBuildScripts,
    getProductVersion,
    scripts
};
