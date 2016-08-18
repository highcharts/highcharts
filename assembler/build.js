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
    exclude: null,
    fileOptions: {},
    files: null, // Array of files to compile
    output: './', // Folder to output compiled files
    palette: null, // Highcharts palette
    pretty: true,
    umd: true, // Wether to use UMD pattern or a module pattern
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
        options.palette = (options.palette) ? options.palette : p.getPalette('./css/highcharts.scss');
        p.printPalette(options.output + 'palette.html', options.palette);
        options.files = (options.files) ? options.files : getFilesInFolder(options.base, true);
        getIndividualOptions(options)
            .forEach((o, i, arr) => {
                let file = d.compileFile(o);
                file = p.preProcess(file, o.build);
                if (o.pretty) {
                    file = beautify(file);
                }
                fs.writeFileSync(o.outputPath, file, 'utf8');
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

module.exports = {
    build: build
};
