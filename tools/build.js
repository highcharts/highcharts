/* eslint-env node, es6 */
/* eslint no-console:0, no-path-concat:0, no-nested-ternary:0, valid-jsdoc:0 */
/* eslint-disable func-style */
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
const replaceAll = (str, search, replace) => str.split(search).join(replace);
const isArray = x => Array.isArray(x);
const isString = x => typeof x === 'string';
const isUndefined = (x) => typeof x === 'undefined';

/**
 * Get the product version from build.properties.
 * The product version is used in license headers and in package names.
 * @return {string|null} Returns version number or null if not found.
 */
const getProductVersion = () => {
    const properties = readFileSync('./build.properties', 'utf8');
    return regexGetCapture(/product\.version=(.+)/, properties);
};

/**
 * Returns fileOptions for the build script
 * @todo Move this functionality to the build script,
 *   and reuse it on github.highcharts.com
 * @return {Object} Object containing all fileOptions
 */
const getFileOptions = (files) => {
    const highchartsFiles = replaceAll(
        getOrderedDependencies('js/masters/highcharts.src.js')
        .map((path) => relative('js', path))
        .join('|'),
        sep,
        `\\${sep}`
    );
    // Modules should not be standalone, and they should exclude all parts files.
    const fileOptions = files
        .reduce((obj, file) => {
            if (
              file.indexOf('modules') > -1 ||
              file.indexOf('themes') > -1 ||
              file.indexOf('indicators') > -1
            ) {
                obj[file] = {
                    exclude: new RegExp(highchartsFiles),
                    umd: false
                };
            }
            return obj;
        }, {});

    /**
     * Special cases
     * solid-gauge should also exclude gauge-series
     * highcharts-more and highcharts-3d is also not standalone.
     */
    if (fileOptions['modules/solid-gauge.src.js']) {
        fileOptions['modules/solid-gauge.src.js'].exclude = new RegExp([highchartsFiles, 'GaugeSeries\.js$'].join('|'));
    }
    if (fileOptions['modules/map.src.js']) {
        fileOptions['modules/map.src.js'].product = 'Highmaps';
    }
    if (fileOptions['modules/map-parser.src.js']) {
        fileOptions['modules/map-parser.src.js'].product = 'Highmaps';
    }
    Object.assign(fileOptions, {
        'highcharts-more.src.js': {
            exclude: new RegExp(highchartsFiles),
            umd: false
        },
        'highcharts-3d.src.js': {
            exclude: new RegExp(highchartsFiles),
            umd: false
        },
        'highmaps.src.js': {
            product: 'Highmaps'
        },
        'highstock.src.js': {
            product: 'Highstock'
        }
    });
    return fileOptions;
};

const getBuildOptions = (input) => {
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
    const type = (
        isArray(input.type) ?
        input.type :
        (
            isString(input.type) ?
            input.type.split(',') :
            ['classic', 'css']
        )
    );
    const fileOptions = getFileOptions(files);
    const mapTypeToSource = {
        'classic': './code/es-modules',
        'css': './code/js/es-modules'
    };
    return {
        base,
        debug,
        fileOptions,
        files,
        output,
        type,
        version,
        mapTypeToSource
    };
};

const scripts = (params) => {
    checkDependency('highcharts-assembler', 'warn', 'devDependencies');
    const options = getBuildOptions(params);
    return build(options);
};


const getListOfDependencies = (files, fileOptions, pathSource) => {
    const dependencyList = {};
    files.forEach((filename) => {
        const options = fileOptions[filename];
        const exclude = (
            !isUndefined(options) && !isUndefined(options.exclude) ?
            options.exclude :
            false
        );
        const pathFile = join(pathSource, 'masters', filename);
        const list = getOrderedDependencies(pathFile)
            .filter((pathModule) => {
                let result = true;
                if (exclude) {
                    result = !exclude.test(pathModule);
                }
                return result;
            })
            .map((str) => {
                return resolve(str);
            });
        dependencyList[pathFile] = list;
    });
    return dependencyList;
};

const getTime = () => {
    const date = new Date();
    const pad = val => {
        return (val <= 9 ? '0' + val : '' + val);
    };
    return [
        pad(date.getHours()),
        pad(date.getMinutes()),
        pad(date.getSeconds())
    ].join(':');
};

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
            .map((type) => `- ${join(output, type === 'css' ? 'js' : '', 'es-modules', pathRelative)}`.gray)
            .join('\n')
    ].join('\n'));
    return buildModules({
        base: base,
        files: [pathRelative.split(sep).join('/')],
        output: output,
        type: types
    });
};

const watchESModules = (event, options, type, dependencies, pathESMasters) => {
    const pathFile = event.path;
    const filesModified = Object.keys(dependencies)
      .reduce((arr, pathMaster) => {
          const list = dependencies[pathMaster];
          if (list.includes(pathFile)) {
              arr.push(relative(pathESMasters, pathMaster).split(sep).join('/'));
          }
          return arr;
      }, []);
    console.log([
        `${event.type}:`.cyan + ` ${relative('.', pathFile)} ` +
        getTime().gray,
        'Rebuilding files: '.cyan,
        filesModified
          .map(str => `- ${join('code', type === 'css' ? 'js' : '', str)}`.gray)
          .join('\n')
    ].join('\n'));
    const {
        debug,
        fileOptions,
        version
    } = options;
    return buildDistFromModules({
        base: pathESMasters,
        debug: debug,
        fileOptions: fileOptions,
        files: filesModified,
        output: './code/',
        type: [type],
        version: version
    });
};

const fnFirstBuild = (options) => {
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
    const promises = types.map((type) => {
        const pathSource = mapTypeToSource[type];
        const pathESMasters = join(pathSource, 'masters');
        return buildDistFromModules({
            base: pathESMasters,
            debug: debug,
            fileOptions: fileOptions,
            files: files,
            output: './code/',
            type: [type],
            version: version
        });
    });
    return Promise.all(promises);
};

const getBuildScripts = (params) => {
    checkDependency('highcharts-assembler', 'warn', 'devDependencies');
    const options = getBuildOptions(params);
    const {
        files,
        type: types,
        fileOptions,
        mapTypeToSource
    } = options;
    const result = {
        fnFirstBuild: () => {
            return fnFirstBuild(options);
        },
        mapOfWatchFn: {
            'js/**/*.js': (event) => {
                return watchSourceFiles(event, types);
            }
        }
    };
    types.forEach((type) => {
        const pathSource = mapTypeToSource[type];
        const pathESMasters = join(pathSource, 'masters');
        const key = join(pathSource, '**/*.js').split(sep).join('/');
        const fn = (event) => {
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
    getFileOptions,
    getProductVersion,
    scripts
};
