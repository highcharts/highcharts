'use strict';
let d = require('./assembler/dependencies'),
	fs = require('fs');
/**
 * [getFilesInFolder description]
 * @param  {[type]} base              [description]
 * @param  {[type]} includeSubfolders [description]
 * @param  {[type]} path              [description]
 * @return {[type]}                   [description]
 */
const getFilesInFolder = (base, includeSubfolders, path) => {
    const fs = require('fs');
    let filenames = [],
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

let defaultOptions = {
    base: undefined, // Path to where the build files are located
    excludes: {},
    files: undefined, // Array of files to compile
    output: './', // Folder to output compiled files
    pretty: true,
    umd: true
};

/**
 * [build description]
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
const build = userOptions=> {
    // userOptions is an empty object by default
    userOptions = (typeof userOptions === 'undefined') ? {} : userOptions;
    // Merge the userOptions with defaultOptions
    let options = Object.assign(defaultOptions, userOptions);
    // Check if required options are set
    if (options.base) {
        options.files = (options.files) ? options.files : getFilesInFolder(options.base, true);
        options.files.forEach(function (filename) {
        	let compiled = d.compileFile(options.base + filename, options.umd, options.pretty);
			fs.writeFileSync(options.output + filename, compiled, 'utf8');

        //     // compileFile(options.base, options.output, filename, options.excludes[filename], options.wrapper);
        //     compileFile(options.base , options.output, filename, options.excludes[filename], options.wrapper);
        });
    } else {
        outPutMessage('Missing required option!', 'The options \'base\' is required for the script to run');
    }
}

module.exports = {
	build: build
};