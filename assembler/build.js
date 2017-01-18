/* eslint-env node, es6 */
/* eslint func-style: ["error", "expression"] */
'use strict';
const d = require('./dependencies');
const p = require('./process.js');
const U = require('./utilities.js');
const fs = require('fs');
const beautify = require('js-beautify').js_beautify;

/**
 * [getFilesInFolder description]
 * @param  {[type]} base              [description]
 * @param  {[type]} includeSubfolders [description]
 * @param  {[type]} path              [description]
 * @returns {[type]}                   [description]
 */
const getFilesInFolder = (base, includeSubfolders, path) => {
    let filenames = [],
        filepath,
        isDirectory;
    path = (typeof path === 'undefined') ? '' : path;
    fs.readdirSync(base + path).forEach((filename) => {
        filepath = base + path + filename;
        isDirectory = fs.lstatSync(filepath).isDirectory();
        if (isDirectory && includeSubfolders) {
            filenames = filenames.concat(getFilesInFolder(base, includeSubfolders, path + filename + '/'));
        } else if (!isDirectory) {
            filenames.push(path + filename);
        }
    });
    return filenames;
};

/**
 * Left pad a string
 * @param  {string} str    The string we want to pad.
 * @param  {string} char   The character we want it to be padded with.
 * @param  {number} length The length of the resulting string.
 * @returns {string}        The string with padding on left.
 */
const leftPad = (str, char, length) => char.repeat(length - str.length) + str;

const getDate = () => {
    const date = new Date();
    const pad = (str) => leftPad(str, '0', 2);
    return ['' + date.getFullYear(), pad('' + (date.getMonth() + 1)), pad('' + date.getDate())].join('-');
};

/**
 * Get options foreach individual
 * @param  {object} options General options for all files
 * @returns {[object]}       Array of indiviual file options
 */
const getIndividualOptions = (options) => {
    return options.files.reduce((arr, filename) => {
        let o = Object.assign({}, options, options.fileOptions && options.fileOptions[filename]);
        o.entry = o.base + filename;
        delete o.fileOptions;
        let types = o.type === 'both' ? ['classic', 'css'] : [o.type];
        let typeOptions = types.map(t => {
            let folder = t === 'classic' ? '' : 'js/';
            let build = {
                classic: {
                    assembly: true,
                    classic: true,
                    palette: o.palette
                },
                css: {
                    classic: false,
                    palette: o.palette
                }
            };
            return Object.assign({
                build: build[t]
            }, o, {
                type: t,
                outputPath: options.output + folder + filename,
                filename: filename
            });
        });
        return arr.concat(typeOptions);
    }, []);
};

let defaultOptions = {
    base: null, // Path to where the build files are located
    date: null,
    exclude: null,
    fileOptions: {},
    files: null, // Array of files to compile
    jsBase: null, // Path to where the js folder is located. Used when masters file is not in same location as the source files. @todo Refine this logic.
    output: './', // Folder to output compiled files
    palette: null, // Highcharts palette
    pretty: true,
    product: 'Highcharts', // Which product we're building.
    umd: true, // Wether to use UMD pattern or a module pattern
    version: 'x.x.x', // Version number of Highcharts
    /**
     * Transpile ES6 to ES5.
     * Do not activate without seriously considering performance first.
     * Once activated in one system, it will have to be activated in all.
     * Requires babel-core@^6.21.0 and additional presets.
     */
    transpile: false,
    type: 'classic' // Type of Highcharts version. Classic or css.
};

/**
 * Function which gathers all dependencies, merge options and build the final distribution file.
 * @param  {object|undefined} userOptions Build options set by the user
 * @returns {undefined} No return value
 */
const build = userOptions=> {
    // userOptions is an empty object by default
    userOptions = (typeof userOptions === 'undefined') ? {} : userOptions;
    // Merge the userOptions with defaultOptions
    let options = Object.assign({}, defaultOptions, userOptions);
    // Check if required options are set
    if (options.base) {
        options.palette = (options.palette) ? options.palette : p.getPalette((options.jsBase ? options.jsBase : options.base + '../') + '../css/highcharts.scss');
        p.printPalette(options.output + 'palette.html', options.palette);
        options.date = options.date ? options.date : getDate();
        options.files = (options.files) ? options.files : getFilesInFolder(options.base, true);
        getIndividualOptions(options)
            .forEach((o, i, arr) => {
                let file = d.compileFile(o);
                file = p.preProcess(file, o.build);
                if (o.transpile) {
                    file = p.transpile(file);
                }
                if (o.pretty) {
                    file = beautify(file);
                }
                U.writeFile(o.outputPath, file);
                U.debug(o.debug, [
                    'Completed ' + (i + 1) + ' of ' + arr.length,
                    '- type: ' + o.type,
                    '- entry: ' + o.entry,
                    '- output: ' + o.outputPath
                ].join('\n'));
            });
    } else {
        U.debug(true, 'Missing required option! The options \'base\' is required for the script to run');
    }
};

const buildModules = userOptions => {
    // userOptions is an empty object by default
    userOptions = (typeof userOptions === 'undefined') ? {} : userOptions;
    // Merge the userOptions with defaultOptions
    let options = Object.assign({}, defaultOptions, userOptions);
    // Check if required options are set
    if (options.base) {
        options.palette = (options.palette) ? options.palette : p.getPalette((options.pathPalette ? options.pathPalette : options.base + '../css/highcharts.scss'));
        options.files = getFilesInFolder(options.base, true).filter(path => path.endsWith('.js'));
        getIndividualOptions(options)
            .forEach((o) => {
                let content = U.getFile(o.entry);
                let outputPath = options.output + o.type + '/' + o.filename;
                let file = p.preProcess(content, o.build);
                U.writeFile(outputPath, file);
            });
    } else {
        U.debug(true, 'Missing required option! The options \'base\' is required for the script to run');
    }
};

module.exports = {
    build,
    buildModules,
    getFilesInFolder
};
