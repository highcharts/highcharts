/**
 * @author  Jon Arild Nygård
 * @description Build script for Highcharts distribution files
 * @license ?
 */
var defaultOptions = {
    base: undefined, // Path to where the build files are located
    files: undefined // Array of files to compile
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
        values = args.map(function (arg) {
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
function compile(base, filename)  {
    var webpack = require('webpack'),
        path = require('path');
    return webpack({
        entry: base + filename,
        output: {
            filename: 'code/' + filename
        },
        module: {
            loaders: [{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }]
        },
        resolve: {
            extensions: ['', '.js']
        },
        debug: true
    }).run(function (err, stats) {
        var jsonStats = stats.toJson();
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
            outPutMessage(filename + ' complete', 'Congratulations! ' + filename + ' compiled without any warnings or errors.');
        }
    });
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
        if (!options.files) {
            options.files = getFilesInFolder(options.base, true);
        }
        doCompile = function (filename) {
            compile(options.base, filename);
        };
        options.files.forEach(doCompile);
    } else {
        outPutMessage('Missing required option!', 'The options \'base\' is required for the script to run');
    }
}

module.exports = build;