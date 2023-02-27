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
    buildModules,
    buildDistFromModules,
    getFilesInFolder
} = require('highcharts-assembler/src/build.js');
const {
    getOrderedDependencies,
    getRequires
} = require('highcharts-assembler/src/dependencies.js');
const {
    exists,
    getFile
} = require('highcharts-assembler/src/utilities.js');
const {
    checkDependency
} = require('./filesystem.js');
const build = require('highcharts-assembler/index.js');

// TODO move to a utils file
const isArray = x => Array.isArray(x);

/**
 * Get the product version from package.json.
 * The product version is used in license headers and in package names.
 * @return {string|null} Returns version number or null if not found.
 */
const getProductVersion = () => require('../package.json').version;

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
            getFilesInFolder(base, true).filter(path => path.endsWith('.js'))
    );
    const type = ['classic'];
    const mapTypeToSource = {
        classic: join(output, 'es-modules'),
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

// Copy from assembler. TODO: Load from assembler when it has been updated.
const getExcludedFilenames = (requires, base) => requires
    .reduce((arr, name) => {
        const filePath = join(
            base,
            `${name.replace('highcharts/', '')}.src.js`
        );
        const dependencies = exists(filePath) ?
            getOrderedDependencies(filePath).map(str => resolve(str)) :
            [];
        return arr.concat(dependencies);
    },
    []);

const getListOfDependencies = (files, pathSource) => {
    const dependencyList = {};
    files.forEach(filename => {
        const base = join(pathSource, 'masters');
        const pathFile = join(base, filename);
        const contentEntry = getFile(pathFile);
        const requires = getRequires(contentEntry);
        const excludes = getExcludedFilenames(requires, base);
        const list = getOrderedDependencies(pathFile)
            .filter(pathModule => !excludes.includes(resolve(pathModule)))
            .map(str => resolve(str));
        dependencyList[pathFile] = list;
    });
    return dependencyList;
};

const getTime = () => (new Date()).toTimeString().substr(0, 8);

const watchSourceFiles = (event, { output, type: types, version }) => {
    const pathFile = event.path;
    const base = './js/';
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
        type: types,
        version
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
        output,
        version
    } = options;
    return buildDistFromModules({
        base: pathESMasters,
        debug,
        fileOptions,
        files: filesModified,
        output,
        type: [type],
        version
    });
};

const fnFirstBuild = options => {
    // Build all module files
    const pathJSParts = './js/';
    const {
        type: types,
        mapTypeToSource,
        debug,
        fileOptions,
        files,
        output,
        version
    } = options;
    buildModules({
        base: pathJSParts,
        output,
        type: types,
        version
    });
    const promises = [];
    types.forEach(type => {
        const pathSource = mapTypeToSource[type];
        const pathESMasters = join(pathSource, 'masters');
        promises.push(buildDistFromModules({
            base: pathESMasters,
            debug,
            fileOptions,
            files,
            output,
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
        mapTypeToSource
    } = options;
    const result = {
        fnFirstBuild: () => fnFirstBuild(options),
        mapOfWatchFn: {
            'js/**/*.js': event => watchSourceFiles(event, options)
        }
    };
    types.forEach(type => {
        const pathSource = mapTypeToSource[type];
        const pathESMasters = join(pathSource, 'masters');
        const key = join(pathSource, '**/*.js').split(sep).join('/');
        const fn = event => {
            const dependencies = getListOfDependencies(
                files,
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
