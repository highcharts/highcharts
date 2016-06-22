'use strict';
const d = require('./assembler/dependencies');
const fs = require('fs');
/**
 * [getFilesInFolder description]
 * @param  {[type]} base              [description]
 * @param  {[type]} includeSubfolders [description]
 * @param  {[type]} path              [description]
 * @return {[type]}                   [description]
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
}

let defaultOptions = {
    base: undefined, // Path to where the build files are located
    exclude: undefined,
    fileOptions: {},
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
        options.files.forEach((filename, i, arr) => {
            let fileOptions = Object.assign(options, options.fileOptions && options.fileOptions[filename]);
            fileOptions.entry = fileOptions.base + filename;
            delete fileOptions.fileOptions;
        	let compiled = d.compileFile(fileOptions);
			fs.writeFileSync(options.output + filename, compiled, 'utf8');
            console.log((i + 1) + ' of ' + arr.length + '. Finished building: ' + filename)

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