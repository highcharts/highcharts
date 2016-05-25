'use strict'
/**
 * @author  Jon Arild Nygård
 * @description Build script for Highcharts distribution files
 * @license ?
 */
var defaultOptions = {
    base: undefined, // Path to where the build files are located
    excludes: {},
    files: undefined, // Array of files to compile
    output: './' // Folder to output compiled files
};

/**
 * [unique description]
 * @param  {[type]} arr1 [description]
 * @param  {[type]} arr2 [description]
 * @return {[type]}      [description]
 */
function unique(arr) {
    // return [... new Set(arr1.concat(arr2)]; // ES6 syntax
    var unique = [];
    arr.forEach(function (item) {
        if(unique.indexOf(item) === -1) {
            unique.push(item);
        }
    });
    return unique;
}

/**
 * [convert description]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
function convert(obj) {
    var arr = Object.keys(obj).map(function (key) {
        return obj[key];
    });
    return arr;
}

/**
 * Shallow merge
 * @return {[type]} [description]
 */
function merge() {
    var merged = {},
        args = convert(arguments),
        keys = args.reduce(function (prev, curr, i, arr) {
            return prev.concat(Object.keys(curr));
        }, []),
        uniqueKeys = unique(keys);
    uniqueKeys.forEach(function (key, i) {
        var values = args.map(function (arg) {
            return arg[key];
        });
        merged[key] = values.find(function (value) {
            return typeof value !== 'undefined';
        });
    });
    return merged;
}

/**
 * [outPutMessage description]
 * @param  {[type]} title   [description]
 * @param  {[type]} message [description]
 * @return {[type]}         [description]
 */
function outPutMessage(title, message) {
    var lineLength = 50,
        line = new Array(lineLength + 1).join('-');
    console.log(line);
    console.log('----- ' + title);
    console.log(line);
    console.log(message);
    console.log(line);
    console.log('');
}

/**
 * Handles the building process of a single file
 * @param  {string} base Path to where the build files are located
 * @param  {string} filename The name of the source file to build
 * @return {?} Some sort of webpack response
 */
function compile(base, output, filename, exclude)  {
    var webpack = require('webpack');
    return webpack({
        entry: base + filename,
        output: {
            filename: output + filename
        },
        module: {
            loaders: [{
                test: function (module) {
                    return exclude ? exclude.test(module) : false;
                },
                loader: 'null-loader'
            }, {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    plugins: ['transform-es2015-modules-commonjs']
                }
            }]
        },
        resolve: {
            extensions: ['', '.js']
        },
        debug: true
    }).run(function (err, stats) {
        var fs = require('fs'),
            jsonStats = stats.toJson(),
            path = stats.compilation.options.output.filename,
            source;
        if (err) {
            outPutMessage(filename + ' fatal errors', err);
        } else if (jsonStats.errors.length > 0) {
            jsonStats.errors.forEach(function (m) {
                outPutMessage(filename + ' error', m);
            });
        } else if (jsonStats.warnings.length > 0) {
            jsonStats.warnings.forEach(function (m) {
                outPutMessage(filename + ' warnings', m);
            });
        } else {
            source = fs.readFileSync(path, 'utf-8');
            source = postProcess(source);
            fs.writeFileSync(path, source);
            outPutMessage(filename + ' complete', 'Congratulations! ' + filename + ' compiled without any warnings or errors.');
        }
    });
}

/**
 * [preProcess description]
 * @param  {[type]} code [description]
 * @return {[type]}      [description]
 */
const postProcess = code => {
    const beautify = require('js-beautify');
    let modules;
    code = code.split('/************************************************************************/\n')[1];
    code = code.split(/\/\*\s[0-9]+\s\*\/\n/);
    modules = code.map((m, i) => {
        var processed = m;
            console.log(i)
        if (m.indexOf('empty (null-loader)') > -1) {
            processed = '';
        } else if ([0, 1].indexOf(i) > -1) {
            // First module is not interesting in our situation
            processed = '';
        } else {
            processed = processed.replace(/[\S\s]+function _interop.+\n/, '\n');
            processed = processed.slice(0, -9);
            processed = processed.replace(/_Globals2\.default/g, 'Highcharts');
            processed = processed.replace(/_Globals2/g, 'Highcharts');
            processed = beautify(processed);
        }
        return processed;
    });
    return modules.join('');
}

/**
 * [getFilesInFolder description]
 * @param  {[type]} base              [description]
 * @param  {[type]} includeSubfolders [description]
 * @param  {[type]} path              [description]
 * @return {[type]}                   [description]
 */
function getFilesInFolder(base, includeSubfolders, path) {
    var fs = require('fs'),
        filenames = [],
        filepath,
        isDirectory;
        path = (typeof path === 'undefined') ? '' : path;
        fs.readdirSync(base + path).forEach(function (filename) {
            filepath = base + path + filename;
            isDirectory = fs.lstatSync(filepath).isDirectory();
            if (isDirectory && includeSubfolders) {
                filenames = filenames.concat(getFilesInFolder(base, includeSubfolders, path + filename + '/'));
            } else if (!isDirectory) {
                filenames.push(path + filename);
            }
        });
    return filenames;
}

/**
 * [build description]
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
function build(userOptions) {
    var keys,
        options,
        doCompile;
    // userOptions is an empty object by default
    userOptions = (typeof userOptions === 'undefined') ? {} : userOptions;
    // Merge the userOptions with defaultOptions
    options = merge(userOptions, defaultOptions);
    // Check if required options are set
    if (options.base) {
        options.files = (options.files) ? options.files : getFilesInFolder(options.base, true);
        options.files.forEach(function (filename) {
            compile(options.base, options.output, filename, options.excludes[filename]);
        });
    } else {
        outPutMessage('Missing required option!', 'The options \'base\' is required for the script to run');
    }
}

module.exports = build;