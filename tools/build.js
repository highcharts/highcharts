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
} = require('@highcharts/highcharts-assembler/src/build.js');
const {
    getOrderedDependencies,
    getRequires
} = require('@highcharts/highcharts-assembler/src/dependencies.js');
const {
    exists,
    getFile
} = require('@highcharts/highcharts-assembler/src/utilities.js');
const {
    checkDependency
} = require('./filesystem.js');
const build = require('@highcharts/highcharts-assembler/index.js');

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
        namespace = 'Highcharts',
        product = 'Highcharts',
        output = './code/',
        version = getProductVersion(),
        assetPrefix = void 0
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
        namespace,
        output,
        type,
        version,
        mapTypeToSource,
        product,
        assetPrefix
    };
};

const scripts = params => {
    checkDependency('@highcharts/highcharts-assembler', 'warn', 'devDependencies');
    const options = getBuildOptions(params);
    return build(options);
};

// Copy from assembler. TODO: Load from assembler when it has been updated.
const getExcludedFilenames = (requires, base) => requires
    .reduce((arr, name) => {
        const filePath = join(
            base,
            `${name.replace(/^(?:dashboards|highcharts)\//, '')}.src.js`
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

const watchSourceFiles = (event, { namespace, output, type: types, version }) => {
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
        namespace,
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
        namespace,
        output,
        version
    } = options;
    return buildDistFromModules({
        base: pathESMasters,
        debug,
        fileOptions,
        files: filesModified,
        namespace,
        output,
        type: [type],
        version
    });
};

const getPathToEsMasters = (pathSource, base) => {
    // remove empty string
    const splittedPath = base.split('/').filter(name => name);
    return join(pathSource, splittedPath.pop());
};

const fnFirstBuild = options => {
    // Build all module files
    const pathJSParts = './js/';
    const {
        type: types,
        mapTypeToSource,
        base,
        debug,
        fileOptions,
        files,
        namespace,
        output,
        version,
        assetPrefix,
        product
    } = options;
    buildModules({
        base: pathJSParts,
        namespace,
        output,
        type: types,
        version,
        assetPrefix,
        product
    });
    const promises = [];
    types.forEach(type => {
        const pathSource = mapTypeToSource[type];
        const pathESMasters = getPathToEsMasters(pathSource, base);
        promises.push(buildDistFromModules({
            base: pathESMasters,
            debug,
            fileOptions,
            files,
            namespace,
            output,
            type: [type],
            version,
            assetPrefix,
            product
        }));
    });
    return Promise.all(promises);
};

const getBuildScripts = params => {
    checkDependency('@highcharts/highcharts-assembler', 'warn', 'devDependencies');
    const options = getBuildOptions(params);
    const {
        files,
        type: types,
        mapTypeToSource,
        base
    } = options;

    const result = {
        fnFirstBuild: () => fnFirstBuild(options),
        mapOfWatchFn: {
            'js/**/*.js': event => watchSourceFiles(event, options)
        }
    };
    types.forEach(type => {
        const pathSource = mapTypeToSource[type];
        const pathESMasters = getPathToEsMasters(pathSource, base);
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
