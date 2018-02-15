/* eslint-env node, es6 */
/* eslint no-console:0, no-path-concat:0, valid-jsdoc:0 */
/* eslint-disable func-style */
const {
    sep
} = require('path');
const {
    readFileSync
} = require('fs');
const {
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
        getOrderedDependencies('js/masters/highcharts.src.js').join('|'),
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
    fileOptions['modules/solid-gauge.src.js'].exclude = new RegExp([highchartsFiles, 'GaugeSeries\.js$'].join('|'));
    fileOptions['modules/map.src.js'].product = 'Highmaps';
    fileOptions['modules/map-parser.src.js'].product = 'Highmaps';
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

const scripts = (options) => {
    checkDependency('highcharts-assembler', 'err', 'devDependencies');
    const {
        base = './js/masters/',
        debug = false,
        version = getProductVersion(),
        output = './code/'
    } = options;
    const files = (
        isArray(options.files) ?
        options.files :
        getFilesInFolder(base, true)
    );
    const type = (
        isArray(options.type) ?
        options.type :
        (
            isString(options.type) ?
            options.type.split(',') :
            ['classic', 'css']
        )
    );
    const fileOptions = getFileOptions(files);
    return build({
        base: base,
        debug: debug,
        fileOptions: fileOptions,
        files: files,
        output: output,
        type: type,
        version: version
    });
};

module.exports = {
    getFileOptions,
    getProductVersion,
    scripts
};
