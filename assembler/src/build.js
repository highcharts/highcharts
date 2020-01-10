/* eslint-env node, es6 */
/* eslint func-style: ["error", "expression"] */
'use strict';
const defaultOptions = require('./defaultOptions.js');
const {
    compileFile
} = require('./dependencies');
const {
    getPalette,
    preProcess,
    printPalette,
    transpile
} = require('./process.js');
const {
    debug,
    getFile,
    isArray,
    isFunction,
    isObject,
    isString,
    writeFile,
    writeFilePromise
} = require('./utilities.js');
const fs = require('fs');
const {
    join,
    resolve,
    sep
} = require('path');

/**
 * [getFilesInFolder description]
 * @param  {[type]} base              [description]
 * @param  {[type]} includeSubfolders [description]
 * @param  {[type]} path              [description]
 * @return {[type]}                   [description]
 */
const getFilesInFolder = (base, includeSubfolders, path) => {
    let filenames = [];
    const pathSubFolder = isString(path) ? path : '';
    fs.readdirSync(join(base, pathSubFolder)).forEach(filename => {
        const filepath = join(base, pathSubFolder, filename);
        const isDirectory = fs.lstatSync(filepath).isDirectory();
        const isSystemFile = filename.indexOf('.') === 0;
        if (isDirectory && includeSubfolders) {
            filenames = filenames.concat(
                getFilesInFolder(base, includeSubfolders, join(pathSubFolder, filename))
            );
        } else if (!isDirectory && !isSystemFile) {
            filenames.push(join(pathSubFolder, filename).split(sep).join('/'));
        }
    });
    return filenames;
};

/**
 * Left pad a string
 * @param  {string} str    The string we want to pad.
 * @param  {string} char   The character we want it to be padded with.
 * @param  {number} length The length of the resulting string.
 * @return {string}        The string with padding on left.
 */
const leftPad = (str, char, length) => char.repeat(length - str.length) + str;

const getDate = () => {
    const date = new Date();
    const pad = str => leftPad(str, '0', 2);
    return ['' + date.getFullYear(), pad('' + (date.getMonth() + 1)), pad('' + date.getDate())].join('-');
};

const getTypes = type => (
    isArray(type) ? type : type === 'both' ? ['classic', 'css'] : [type]
);

const getProcess = palette => ({
    classic: {
        assembly: true,
        classic: true,
        palette
    },
    css: {
        classic: false,
        palette
    }
});

/**
 * Get options foreach individual
 * @param  {object} options General options for all files
 * @return {[object]}       Array of indiviual file options
 */
const getIndividualOptions = ({
    base,
    cb,
    date,
    exclude,
    files,
    fileOptions = {},
    output,
    palette,
    product,
    type,
    umd,
    version
}) => {
    const process = getProcess(palette);
    return files.reduce((arr, filename) => {
        const options = fileOptions[filename] || {};

        // Pick exclude, product and umd from fileOptions if defined.
        const object = ['exclude', 'product', 'umd'].reduce((obj, key) => {
            // eslint-disable-next-line no-prototype-builtins
            obj[key] = options.hasOwnProperty(key) ? options[key] : obj[key];
            return obj;
        }, {
            base,
            cb,
            date,
            entry: resolve(join(base, filename)),
            exclude,
            product,
            umd,
            version
        });

        // Create a set of options for each type
        const typeOptions = getTypes(type).map(currentType => Object.assign({
            build: process[currentType],
            outputPath: resolve(
                join(output, (currentType === 'classic' ? '' : 'js/'), filename)
            )
        }, object));

        // Add new options sets to the list
        return arr.concat(typeOptions);
    }, []);
};

const getESModuleOptions = (
    { base, date, output, files, palette, product, types, version }
) => {
    const process = getProcess(palette);
    return files.reduce((arr, filename) => {
        const entry = resolve(join(base, filename));
        const typeOptions = types.map(type => ({
            date,
            process: process[type],
            entry,
            outputPath: resolve(join(
                output,
                (type === 'classic' ? '' : 'js/'),
                'es-modules',
                filename
            )),
            product,
            version
        }));
        return arr.concat(typeOptions);
    }, []);
};

/**
 * Function which gathers all dependencies, merge options and build the final distribution file.
 * @param  {object|undefined} userOptions Build options set by the user
 * @return {undefined} No return value
 */
const build = userOptions => {
    // userOptions is an empty object by default
    userOptions = isObject(userOptions) ? userOptions : {};
    // Merge the userOptions with defaultOptions
    const options = Object.assign({}, defaultOptions, userOptions);
    // Check if required options are set
    if (options.base) {
        options.palette = (options.palette) ? options.palette : getPalette((options.jsBase ? options.jsBase : options.base + '../') + '../css/highcharts.scss');
        printPalette(options.output + 'palette.html', options.palette);
        options.date = options.date ? options.date : getDate();
        options.files = (options.files) ? options.files : getFilesInFolder(options.base, true);
        getIndividualOptions(options)
            .forEach((o, i, arr) => {
                let file = compileFile(o);
                file = preProcess(file, o);
                if (o.transpile) {
                    file = transpile(file);
                }
                writeFile(o.outputPath, file);
                debug(o.debug, [
                    'Completed ' + (i + 1) + ' of ' + arr.length,
                    '- type: ' + o.type,
                    '- entry: ' + o.entry,
                    '- output: ' + o.outputPath
                ].join('\n'));
            });
    } else {
        debug(true, 'Missing required option! The options \'base\' is required for the script to run');
    }
};

const buildModules = userOptions => {
    // userOptions is an empty object by default
    userOptions = isObject(userOptions) ? userOptions : {};
    // Merge the userOptions with defaultOptions
    const options = Object.assign({}, defaultOptions, userOptions);

    // Make sure types is an array.
    options.types = getTypes(options.type);

    // Check if required options are set
    if (options.base) {
        options.palette = (options.palette) ?
            options.palette :
            getPalette(
                (
                    isString(options.pathPalette) ?
                        options.pathPalette :
                        options.base + '../css/highcharts.scss'
                )
            );
        options.date = options.date ? options.date : getDate();
        options.files = (
            isArray(options.files) ?
                options.files :
                getFilesInFolder(options.base, true).filter(path => path.endsWith('.js'))
        );
        getESModuleOptions(options)
            .forEach(({ entry, outputPath, process, date, version, product }) => {
                const content = preProcess(
                    getFile(entry),
                    { build: process, date, product, version }
                );
                writeFile(outputPath, content);
            });
    } else {
        debug(true, 'Missing required option! The options \'base\' is required for the script to run');
    }
};

const buildDistFromModules = userOptions => {
    let result;
    const message = {
        errBase: 'Missing required option! The options \'base\' is required for the script to run'
    };
    // userOptions is an empty object by default
    userOptions = isObject(userOptions) ? userOptions : {};
    // Merge the userOptions with defaultOptions
    const options = Object.assign({}, defaultOptions, userOptions);
    // Check if required options are set
    if (options.base) {
        options.files = (
            isArray(options.files) ?
                options.files :
                getFilesInFolder(options.base, true)
        );
        const promises = getIndividualOptions(options)
            .map(o => Promise.resolve(compileFile(o))
                .then(content => writeFilePromise(o.outputPath, content))
                // eslint-disable-next-line no-undefined
                .then(() => (isFunction(o.cb) ? o.cb(o.outputPath) : undefined)));
        result = Promise.all(promises);
    } else {
        result = Promise.reject(new Error(message.errBase));
    }
    return result;
};

module.exports = {
    build,
    buildDistFromModules,
    buildModules,
    getFilesInFolder
};
